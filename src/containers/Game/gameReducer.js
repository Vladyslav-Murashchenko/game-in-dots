import * as R from 'ramda';

import {
  createAction,
  createReducer,
  getRandomArrayItem,
  pipeReduce,
} from '../../utils';

const start = createAction('START', (cellsCount, playerName) => ({
  cellsCount,
  playerName,
}));
const leave = createAction('LEAVE');
const step = createAction('STEP', () => ({
  // generate random here to keep reducer pure function
  random: Math.random(),
}));
const cellClick = createAction('CELL_CLICK', (cell) => ({ cell }));

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
  state.isPlaying && cell === state.stepCell
);

const gameReducer = createReducer({
  [start]: ({ cellsCount, playerName }) => R.mergeLeft({
    cellsCount,
    playerName,
    isPlaying: true,
    unallocatedCells: R.range(0, cellsCount),
    message: 'Catch the blue squares!',
  }),


  [cellClick]: ({ cell }) => pipeReduce(
    R.unless(caughtSuccess(cell), R.reduced),

    R.evolve({
      playerCaughtCell: R.always(true),
      playerCells: R.append(cell),
      unallocatedCells: R.without([cell]),
    }),

    R.when(playerWon, (state) => R.reduced({
      ...state,
      isPlaying: false,
      message: `${state.playerName} won!`,
      winner: state.playerName,
    })),

    R.when(noWinner, R.compose(R.reduced, endGameWithNoWinner)),
  ),


  [step]: ({ random }) => pipeReduce(
    R.when(R.prop('playerCaughtCell'), (state) => R.reduced({
      ...state,
      playerCaughtCell: false,
      stepCell: getRandomArrayItem(state.unallocatedCells, random),
    })),

    (state) => ({
      ...state,
      computerCells: R.append(state.stepCell, state.computerCells),
      unallocatedCells: R.without([state.stepCell], state.unallocatedCells),
    }),

    R.when(computerWon, (state) => R.reduced(({
      ...state,
      isPlaying: false,
      message: 'Computer won :Try again!',
      winner: 'Computer AI',
    }))),

    R.when(noWinner, R.compose(R.reduced, endGameWithNoWinner)),

    (state) => ({
      ...state,
      stepCell: getRandomArrayItem(state.unallocatedCells, random),
    }),
  ),


  [leave]: () => R.always(initialGameState),
});

export default gameReducer;
