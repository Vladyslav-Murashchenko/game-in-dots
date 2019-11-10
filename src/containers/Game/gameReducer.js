import * as R from 'ramda';

import {
  createAction,
  createReducer,
  getRandomArrayItem,
} from '../../utils';

const start = createAction('START', (cellsCount, playerName) => ({
  cellsCount,
  playerName,
}));
const leave = createAction('LEAVE');
const step = createAction('STEP');
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

const gameReducer = createReducer({
  [start]: (state, action) => ({
    ...state,
    cellsCount: action.cellsCount,
    playerName: action.playerName,
    isPlaying: true,
    unallocatedCells: R.range(0, action.cellsCount),
    message: 'Catch the blue squares!',
  }),

  [cellClick]: (state, action) => {
    const { cell } = action;

    if (!state.isPlaying || cell !== state.stepCell) {
      return state;
    }

    const nextState = {
      ...state,
      playerCaughtCell: true,
      playerCells: R.append(cell, state.playerCells),
      unallocatedCells: R.without([cell], state.unallocatedCells),
    };

    if (nextState.playerCells.length > nextState.cellsCount / 2) {
      return {
        ...nextState,
        isPlaying: false,
        message: `${state.playerName} won!`,
        winner: state.playerName,
      };
    }

    if (noWinner(nextState)) {
      return {
        ...nextState,
        isPlaying: false,
        message: 'Nobody won :/',
      };
    }

    return nextState;
  },

  [step]: (state) => {
    if (state.playerCaughtCell) {
      return {
        ...state,
        playerCaughtCell: false,
        stepCell: getRandomArrayItem(state.unallocatedCells),
      };
    }

    const nextState = {
      ...state,
      computerCells: R.append(state.stepCell, state.computerCells),
      unallocatedCells: R.without([state.stepCell], state.unallocatedCells),
    };

    if (nextState.computerCells.length > nextState.cellsCount / 2) {
      return {
        ...nextState,
        isPlaying: false,
        message: 'Computer won :( Try again!',
        winner: 'Computer AI',
      };
    }

    if (noWinner(nextState)) {
      return {
        ...nextState,
        isPlaying: false,
        message: 'Nobody won :/',
      };
    }

    return {
      ...nextState,
      stepCell: getRandomArrayItem(nextState.unallocatedCells),
    };
  },

  [leave]: () => initialGameState,
});

export default gameReducer;
