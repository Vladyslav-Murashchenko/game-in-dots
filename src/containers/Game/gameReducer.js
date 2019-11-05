import createAct from 'redux-create-act';
import * as R from 'ramda';

import { ifAction, getRandomArrayItem } from '../../utils';

const start = createAct('START', (fieldsCount) => ({ fieldsCount }));
const leave = createAct('LEAVE');
const step = createAct('STEP');
const userCatchField = createAct('USER_CATCH_FIELD', (field) => ({ field }));

export const gameActions = {
  start,
  leave,
  step,
  userCatchField,
};

export const initialGameState = {
  userСaughtField: false,
  userFields: [],
  computerFields: [],
  unallocatedFields: [],
  stepField: null,
  fieldsCount: null,
  isPlaying: false,
  message: 'Catch the blue squares!',
};

const noWinner = (state) => (
  !state.unallocatedFields.length && state.computerFields.length === state.userFields.length
);

const gameReducer = R.cond([
  [ifAction(start), (state, { fieldsCount }) => {
    const unallocatedFields = R.range(0, fieldsCount);

    return {
      ...state,
      isPlaying: true,
      fieldsCount,
      unallocatedFields,
      stepField: getRandomArrayItem(unallocatedFields),
    };
  }],

  [ifAction(userCatchField), (state, { field }) => {
    if (field !== state.stepField) {
      return state;
    }

    const nextState = {
      ...state,
      userСaughtField: true,
      userFields: R.append(field, state.userFields),
      unallocatedFields: R.without([field], state.unallocatedFields),
    };

    if (nextState.userFields.length > nextState.fieldsCount / 2) {
      return {
        ...nextState,
        isPlaying: false,
        message: 'You win!',
      };
    }

    if (noWinner(nextState)) {
      return {
        ...nextState,
        isPlaying: false,
        message: 'Nobody win :/',
      };
    }

    return nextState;
  }],

  [ifAction(step), (state) => {
    if (!state.isPlaying) {
      return state;
    }

    if (state.userСaughtField) {
      return {
        ...state,
        userСaughtField: false,
        stepField: getRandomArrayItem(state.unallocatedFields),
      };
    }

    const nextUnallocatedFields = R.without([state.stepField], state.unallocatedFields);
    const nextState = {
      ...state,
      computerFields: R.append(state.stepField, state.computerFields),
      unallocatedFields: nextUnallocatedFields,
    };

    if (nextState.computerFields.length > nextState.fieldsCount / 2) {
      return {
        ...nextState,
        isPlaying: false,
        message: 'Computer win :( Try again!',
      };
    }

    if (noWinner(nextState)) {
      return {
        ...nextState,
        isPlaying: false,
        message: 'Nobody win :/',
      };
    }

    return {
      ...nextState,
      stepField: getRandomArrayItem(nextUnallocatedFields),
    };
  }],

  [ifAction(leave), R.always(initialGameState)],

  [R.T, R.identity],
]);

export default gameReducer;
