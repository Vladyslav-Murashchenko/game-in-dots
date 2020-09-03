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

import Routes from './Routes';

const App = () => (
  <Router>
    <AppHeader />
    <Switch>
      <Route path={Routes.GAME}>
        <Game />
      </Route>
      <Route path={Routes.LEADER_BOARD}>
        <LeaderBoard />
      </Route>
      <Redirect to={Routes.GAME} />
    </Switch>
  </Router>
);

export default App;
