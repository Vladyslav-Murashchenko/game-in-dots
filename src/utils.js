import * as R from 'ramda';

const defaultActionCreator = () => ({});

export const createAction = (type, typelessActionCreator = defaultActionCreator) => {
  const actionCreator = (...args) => ({
    ...typelessActionCreator(...args),
    type,
  });

  return Object.assign(actionCreator, {
    type,
    toString: () => type,
  });
};

const checkAction = (actionCreatorType) => (_, action) => (
  R.equals(actionCreatorType, action.type)
);

const headLens = R.lensIndex(0);

export const createReducer = R.pipe(
  R.toPairs,
  R.map(R.over(headLens, checkAction)),
  R.append([R.T, R.identity]),
  R.cond,
);

const randomInteger = (maxInt) => Math.floor(Math.random() * (maxInt + 1));

const getRandomArrayIndex = R.pipe(R.length, R.dec, randomInteger);

export const getRandomArrayItem = (arr) => arr[getRandomArrayIndex(arr)];

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
