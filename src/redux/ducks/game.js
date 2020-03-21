import * as R from 'ramda';

import {
  createAction,
  createReducer,
  getRandomArrayItem,
  pipeWithStop,
  stopPipe,
} from '../../utils';

export const gameSelector = (state) => state.game;

const start = createAction('GAME_START', (cellsCount, playerName) => ({
  cellsCount,
  playerName,
}));
const leave = createAction('GAME_LEAVE');
const step = createAction('GAME_STEP', () => ({
  // generate random here to keep reducer pure function
  random: Math.random(),
}));
const cellClick = createAction('GAME_CELL_CLICK', (cell) => ({ cell }));

export const gameActions = {
  start,
  leave,
  step,
  cellClick,
};

export const initialGameState = {
  playerName: null,
  playerCaughtCell: false,
  playerCells: [],
  computerCells: [],
  unallocatedCells: [],
  stepCell: null,
  cellsCount: null,
  isPlaying: false,
  message: 'Press play to start! And catch the blue squares!',
  winner: null,
};

const noWinner = (state) => (
  !state.unallocatedCells.length && state.computerCells.length === state.playerCells.length
);

const endGameWithNoWinner = R.mergeLeft({
  isPlaying: false,
  message: 'Nobody won :/',
});

const checkWinner = (side) => (state) => (
  state[`${side}Cells`].length > state.cellsCount / 2
);

const computerWon = checkWinner('computer');
const playerWon = checkWinner('player');

const caughtSuccess = (cell) => (state) => (
  state.isPlaying && !state.playerCaughtCell && cell === state.stepCell
);

const gameReducer = createReducer(initialGameState, {
  [start]: ({ cellsCount, playerName }) => R.mergeLeft({
    cellsCount,
    playerName,
    isPlaying: true,
    unallocatedCells: R.range(0, cellsCount),
    message: 'Catch the blue squares!',
  }),


  [cellClick]: ({ cell }) => pipeWithStop([
    R.unless(caughtSuccess(cell), stopPipe),

    R.evolve({
      playerCaughtCell: R.always(true),
      playerCells: R.append(cell),
      unallocatedCells: R.without([cell]),
    }),

    R.when(playerWon, (state) => stopPipe({
      ...state,
      isPlaying: false,
      message: `${state.playerName} won!`,
      winner: state.playerName,
    })),

    R.when(noWinner, endGameWithNoWinner),
  ]),


  [step]: ({ random }) => pipeWithStop([
    R.when(R.propEq('stepCell', null), (state) => stopPipe({
      ...state,
      stepCell: getRandomArrayItem(state.unallocatedCells, random),
    })),

    R.when(R.prop('playerCaughtCell'), (state) => stopPipe({
      ...state,
      playerCaughtCell: false,
      stepCell: getRandomArrayItem(state.unallocatedCells, random),
    })),

    (state) => ({
      ...state,
      computerCells: R.append(state.stepCell, state.computerCells),
      unallocatedCells: R.without([state.stepCell], state.unallocatedCells),
    }),

    R.when(computerWon, (state) => stopPipe(({
      ...state,
      isPlaying: false,
      message: 'Computer won :Try again!',
      winner: 'Computer AI',
    }))),

    R.when(noWinner, R.compose(stopPipe, endGameWithNoWinner)),

    (state) => ({
      ...state,
      stepCell: getRandomArrayItem(state.unallocatedCells, random),
    }),
  ]),


  [leave]: () => R.always(initialGameState),
});

export default gameReducer;
