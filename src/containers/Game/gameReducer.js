import createAct from 'redux-create-act';
import * as R from 'ramda';

import { ifAction, getRandomArrayItem } from '../../utils';

const start = createAct('START', (fieldsCount, playerName) => ({
  fieldsCount,
  playerName,
}));
const leave = createAct('LEAVE');
const step = createAct('STEP');
const catchField = createAct('CATCH_FIELD', (field) => ({ field }));

export const gameActions = {
  start,
  leave,
  step,
  catchField,
};

export const initialGameState = {
  playerName: null,
  playerСaughtField: false,
  playerFields: [],
  computerFields: [],
  unallocatedFields: [],
  stepField: null,
  fieldsCount: null,
  isPlaying: false,
  message: 'Press play to start! And catch the blue squares!',
  winner: null,
};

const noWinner = (state) => (
  !state.unallocatedFields.length && state.computerFields.length === state.playerFields.length
);

const gameReducer = R.cond([
  [ifAction(start), (state, {
    fieldsCount,
    playerName,
  }) => ({
    ...state,
    fieldsCount,
    playerName,
    isPlaying: true,
    unallocatedFields: R.range(0, fieldsCount),
    message: 'Catch the blue squares!',
  })],

  [ifAction(catchField), (state, { field }) => {
    if (!state.isPlaying || field !== state.stepField) {
      return state;
    }

    const nextState = {
      ...state,
      playerСaughtField: true,
      playerFields: R.append(field, state.playerFields),
      unallocatedFields: R.without([field], state.unallocatedFields),
    };

    if (nextState.playerFields.length > nextState.fieldsCount / 2) {
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
  }],

  [ifAction(step), (state) => {
    if (state.playerСaughtField) {
      return {
        ...state,
        playerСaughtField: false,
        stepField: getRandomArrayItem(state.unallocatedFields),
      };
    }

    const nextState = {
      ...state,
      computerFields: R.append(state.stepField, state.computerFields),
      unallocatedFields: R.without([state.stepField], state.unallocatedFields),
    };

    if (nextState.computerFields.length > nextState.fieldsCount / 2) {
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
      stepField: getRandomArrayItem(nextState.unallocatedFields),
    };
  }],

  [ifAction(leave), R.always(initialGameState)],

  [R.T, R.identity],
]);

export default gameReducer;
