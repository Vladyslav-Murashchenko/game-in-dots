import * as R from 'ramda';

import {
  createAction,
  createReducer,
  getRandomArrayItem,
  pipeWithStop,
  stopPipe,
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

export const GAME_STATUS = {
  preparing: 'preparing',
  playing: 'playing',
  finished: 'finished',
};

export const initialGameState = {
  status: GAME_STATUS.preparing,
  playerName: null,
  playerCaughtCell: false,
  playerCells: [],
  computerCells: [],
  unallocatedCells: [],
  currentStepCell: null,
  cellsCount: null,
  message: 'Press play to start! And catch the blue squares!',
  winner: null,
};

const noWinner = (state) =>
  !state.unallocatedCells.length &&
  state.computerCells.length === state.playerCells.length;

const endGameWithNoWinner = R.mergeLeft({
  status: GAME_STATUS.finished,
  message: 'Nobody won :/',
});

const checkWinner = (side) => (state) =>
  state[`${side}Cells`].length > state.cellsCount / 2;

const computerWon = checkWinner('computer');
const playerWon = checkWinner('player');

const caughtSuccess = (cell) => (state) =>
  state.status === GAME_STATUS.playing &&
  !state.playerCaughtCell &&
  cell === state.currentStepCell;

const gameReducer = createReducer({
  [start]: ({ cellsCount, playerName }) =>
    R.mergeLeft({
      cellsCount,
      playerName,
      status: GAME_STATUS.playing,
      unallocatedCells: R.range(0, cellsCount),
      message: 'Catch the blue squares!',
    }),

  [cellClick]: ({ cell }) =>
    pipeWithStop([
      R.unless(caughtSuccess(cell), stopPipe),

      R.evolve({
        playerCaughtCell: R.always(true),
        playerCells: R.append(cell),
        unallocatedCells: R.without([cell]),
      }),

      R.when(playerWon, (state) =>
        stopPipe({
          ...state,
          status: GAME_STATUS.finished,
          message: `${state.playerName} won!`,
          winner: state.playerName,
        }),
      ),

      R.when(noWinner, endGameWithNoWinner),
    ]),

  [step]: ({ random }) =>
    pipeWithStop([
      R.when(R.prop('playerCaughtCell'), (state) =>
        stopPipe({
          ...state,
          playerCaughtCell: false,
          currentStepCell: getRandomArrayItem(state.unallocatedCells, random),
        }),
      ),

      (state) => ({
        ...state,
        computerCells: R.append(state.currentStepCell, state.computerCells),
        unallocatedCells: R.without(
          [state.currentStepCell],
          state.unallocatedCells,
        ),
      }),

      R.when(computerWon, (state) =>
        stopPipe({
          ...state,
          status: GAME_STATUS.finished,
          message: 'Computer won :Try again!',
          winner: 'Computer AI',
        }),
      ),

      R.when(noWinner, R.compose(stopPipe, endGameWithNoWinner)),

      (state) => ({
        ...state,
        currentStepCell: getRandomArrayItem(state.unallocatedCells, random),
      }),
    ]),

  [leave]: () => R.always(initialGameState),
});

export default gameReducer;
