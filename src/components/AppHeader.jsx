import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import Button from './Button';

const Header = styled.header`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background: #f1f1f1;
  box-shadow: 0px 0px 10px #333333;
`;

const H1 = styled.h1`
  text-transform: uppercase;
`;

const Nav = styled.nav`
  display: flex;
  margin: 0 20px 0 auto;
`;

const ButtonStyled = styled(Button).attrs({
  type: null,
})`
  margin: 10px;
`;

const AppHeader = () => (
  <Header>
    <H1>Game in dots</H1>
    <Nav>
      <ButtonStyled as={Link} to="/game">Game</ButtonStyled>
      <ButtonStyled as={Link} to="/leader-board">Leader Board</ButtonStyled>
    </Nav>
  </Header>
);

export default AppHeader;
