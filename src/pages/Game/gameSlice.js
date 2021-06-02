import * as R from 'ramda';
import { createSlice } from '@reduxjs/toolkit';
import defineStatusTransitions from '../../utils/defineStatusTransitions';
import getArrayItemByRandom from '../../utils/getArrayItemByRandom';

const preparing = 'preparing';
const playing = 'playing';
const finished = 'finished';

export const GAME_STATUS = {
  preparing,
  playing,
  finished,
};

const whenStatus = defineStatusTransitions({
  [preparing]: [playing],
  [playing]: [playing, preparing, finished],
  [finished]: [preparing],
});

const whenPreparing = whenStatus(preparing);
const whenPlaying = whenStatus(playing);
const whenPlayingOrFinished = whenStatus([playing, finished]);

export const initialGameState = {
  status: GAME_STATUS.preparing,
  playerName: null,
  playerCells: [],
  computerCells: [],
  unallocatedCells: [],
  currentStepCell: null,
  message: 'Press play to start! And catch the blue squares!',
  winner: null,
};

const getCellsCount = (state) =>
  state.computerCells.length +
  state.playerCells.length +
  state.unallocatedCells.length;

const checkWinnerBy = (cellsProp) => (state) =>
  state[cellsProp].length > getCellsCount(state) / 2;

const computerWon = checkWinnerBy('computerCells');
const playerWon = checkWinnerBy('playerCells');

const finishGameIfNeeded = (state) => {
  if (playerWon(state)) {
    return {
      ...state,
      status: GAME_STATUS.finished,
      message: `${state.playerName} won! :)`,
      winner: state.playerName,
    };
  }

  if (computerWon(state)) {
    return {
      ...state,
      status: GAME_STATUS.finished,
      message: 'Computer won :( Try again!',
      winner: 'Computer AI',
    };
  }

  if (!state.unallocatedCells.length) {
    return {
      ...state,
      status: GAME_STATUS.finished,
      message: 'Nobody won :/',
    };
  }

  return state;
};

const computerTryTakeCell = (state) => {
  const { currentStepCell, playerCells, computerCells, unallocatedCells } =
    state;

  if (currentStepCell === null || playerCells.includes(currentStepCell)) {
    return state;
  }

  return {
    ...state,
    computerCells: R.append(currentStepCell, computerCells),
    unallocatedCells: R.without([currentStepCell], unallocatedCells),
  };
};

const gameSlice = createSlice({
  name: 'game',
  initialState: initialGameState,
  reducers: {
    start: whenPreparing((state, action) => {
      const { cellsCount, playerName } = action.payload;

      return {
        ...state,
        status: GAME_STATUS.playing,
        cellsCount,
        playerName,
        unallocatedCells: R.range(0, cellsCount),
        message: 'Catch the blue squares!',
      };
    }),
    step: {
      reducer: whenPlaying((state, action) => {
        const nextState = finishGameIfNeeded(computerTryTakeCell(state));

        if (nextState.status === GAME_STATUS.finished) {
          return nextState;
        }

        const random = action.payload;

        return {
          ...nextState,
          currentStepCell: getArrayItemByRandom(
            random,
            nextState.unallocatedCells,
          ),
        };
      }),
      prepare: () => ({ payload: Math.random() }),
    },
    tryTakeCell: whenPlaying((state, action) => {
      const cell = action.payload;
      const { currentStepCell, playerCells, unallocatedCells } = state;

      if (cell !== currentStepCell || playerCells.includes(cell)) {
        return;
      }

      return finishGameIfNeeded({
        ...state,
        playerCells: R.append(cell, playerCells),
        unallocatedCells: R.without([cell], unallocatedCells),
      });
    }),
    leave: whenPlayingOrFinished(() => initialGameState),
  },
});

export default gameSlice.reducer;

export const { start, step, tryTakeCell, leave } = gameSlice.actions;
