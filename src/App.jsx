import 'normalize.css';
import './App.css';
import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import Game from './pages/Game';
import LeaderBoard from './pages/LeaderBoard';

import { AppHeader } from './components';

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
