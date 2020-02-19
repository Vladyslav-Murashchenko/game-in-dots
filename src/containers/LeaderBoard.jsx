import React, {
  useState,
  useEffect,
} from 'react';
import styled from 'styled-components';
import * as R from 'ramda';

import * as api from '../api';

import {
  Main,
  Loader,
} from '../components';

const LeaderBoard = () => {
  const [winners, setWinners] = useState(null);

  useEffect(() => {
    api.fetchWinners()
      .then(setWinners);
  }, []);

  if (!winners) {
    return (
      <Loader />
    );
  }

  const renderWinners = R.pipe(
    R.reverse,
    R.map(({ winner, date, id }) => (
      <Winner key={id}>
        <Name>{winner}</Name>
        <WinDate>{date}</WinDate>
      </Winner>
    )),
  );

  return (
    <Main>
      <Wrapper>
        <Heading>Leader Board</Heading>
        <Winners>
          {renderWinners(winners)}
        </Winners>
      </Wrapper>
    </Main>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  @media (min-width: 800px) {
    width: 80vw;
  }
`;

const Heading = styled.h2`
  margin: 0 0 1.5rem;
  font-size: 2rem;
  color: #707577;
  text-transform: uppercase;
`;

const Winners = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const Winner = styled.li`
  display: flex;
  justify-content: space-between;

  padding: 1.5vw 3vw;
  background: #cfd8dc;

  margin: 10px 0;

  @media (max-width: 800px) {
    flex-direction: column;
  }
`;

const Name = styled.div`
  margin-right: 50px;

  color: #707577;
  font-size: 1.6rem;
`;

const WinDate = styled.div`
  color: #707577;
  font-size: 1.6rem;
`;

export default LeaderBoard;
