import { combineReducers } from 'redux';

import game from './ducks/game';

const rootReducer = combineReducers({
  game,
});

export default rootReducer;
