import 'normalize.css';
import React from 'react';
import { createGlobalStyle } from 'styled-components';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import Game from './Game';
import LeaderBoard from './LeaderBoard';

import { AppHeader } from '../components';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: sans-serif;
  }
`;

const App = () => (
  <Router>
    <GlobalStyle />
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
