import 'normalize.css';
import './App.css';
import React from 'react';
import { Provider } from 'react-redux';
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import store from '../redux/store';

import Game from './Game';
import LeaderBoard from './LeaderBoard';

import { AppHeader } from '../components';


const App = () => (
  <Provider store={store}>
    <Router>
      <AppHeader />
      <Switch>
        <Route path="/game">
          <Game />
        </Route>
        <Route path="/leader-board">
          <LeaderBoard />
        </Route>
        <Redirect to="/game" />
      </Switch>
    </Router>
  </Provider>
);

export default App;
