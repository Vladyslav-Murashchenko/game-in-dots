import * as R from 'ramda';

import {
  createAction,
  createReducer,
  getRandomArrayItem,
} from '../../utils';

const start = createAction('START', (fieldsCount, playerName) => ({
  fieldsCount,
  playerName,
}));
const leave = createAction('LEAVE');
const step = createAction('STEP');
const catchField = createAction('CATCH_FIELD', (field) => ({ field }));

export const gameActions = {
  start,
  leave,
  step,
  catchField,
};

export const initialGameState = {
  playerName: null,
  playerCaughtField: false,
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

const gameReducer = createReducer({
  [start]: (state, action) => ({
    ...state,
    fieldsCount: action.fieldsCount,
    playerName: action.playerName,
    isPlaying: true,
    unallocatedFields: R.range(0, action.fieldsCount),
    message: 'Catch the blue squares!',
  }),

  [catchField]: (state, action) => {
    const { field } = action;

    if (!state.isPlaying || field !== state.stepField) {
      return state;
    }

    const nextState = {
      ...state,
      playerCaughtField: true,
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
  },

  [step]: (state) => {
    if (state.playerCaughtField) {
      return {
        ...state,
        playerCaughtField: false,
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
  },

  [leave]: () => initialGameState,
});

export default gameReducer;
