import * as R from 'ramda';

const defaultActionCreator = (payload = null) => ({ payload });

export const createAction = (
  type,
  typelessActionCreator = defaultActionCreator,
) => {
  const actionCreator = (...args) => ({
    ...typelessActionCreator(...args),
    type,
  });

  return Object.assign(actionCreator, {
    type,
    toString: () => type,
  });
};

export const createReducer = (caseReducerMap) => (state, action) => {
  const caseReducer = caseReducerMap[action.type];

  if (caseReducer) {
    return caseReducer(action)(state);
  }

  return state;
};

export const getRandomArrayItem = (arr, random = 0.5) => {
  if (!arr.length) {
    throw new Error('Cannot get random item from empty array');
  }

  return arr[Math.floor(random * arr.length)];
};

const stopPipeSymbol = Symbol('break pipe');

const pipeStopped = (value) => value && value[stopPipeSymbol];

export const stopPipe = R.unless(pipeStopped, (value) => ({
  value,
  [stopPipeSymbol]: true,
}));

export const pipeWithStop = R.pipeWith((f, res) =>
  pipeStopped(res) ? res.value : f(res),
);

export const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  year: 'numeric',
  month: 'long',
  day: '2-digit',
});

export const preventDefault = (e) => {
  e.preventDefault();

  return e;
};
