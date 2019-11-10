import 'normalize.css';
import './App.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import Game from './Game';
import LeaderBoard from './LeaderBoard';

import { AppHeader } from '../components';

const App = () => (
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
);

export default App;
