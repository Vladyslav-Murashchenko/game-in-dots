import * as R from 'ramda';

export const ifAction = (...actionCreators) => (_, action) => (
  R.all(R.eqProps('type', action), actionCreators)
);

export const randomInteger = (maxInt) => Math.floor(Math.random() * (maxInt + 1));
export const getRandomArrayItem = R.converge(
  R.nth,
  [R.pipe(R.length, R.subtract(R.__, 1), randomInteger), R.identity],
);
