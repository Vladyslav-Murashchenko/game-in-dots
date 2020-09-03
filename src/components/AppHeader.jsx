import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import Button from './Button';

import Routes from '../Routes';

const AppHeader = () => (
  <Header>
    <Heading>Game in dots</Heading>
    <Nav>
      <ButtonStyled as={Link} to={Routes.GAME}>
        Game
      </ButtonStyled>
      <ButtonStyled as={Link} to={Routes.LEADER_BOARD}>
        Leader Board
      </ButtonStyled>
    </Nav>
  </Header>
);

const Header = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 1vw 2vw;
  background: var(--secondary1);
  box-shadow: 0px 0px 10px #333333;

  @media (min-width: 620px) {
    justify-content: space-between;
  }
`;

const Heading = styled.h1`
  text-transform: uppercase;
  font-size: 2.5rem;
  color: var(--primary1);
  margin: 0;
`;

const Nav = styled.nav`
  display: flex;
  width: 275px;

  @media (min-width: 800px) {
    width: auto;
  }
`;

const ButtonStyled = styled(Button).attrs({
  type: null,
})`
  margin: 10px;
`;

export default AppHeader;
