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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Heading = styled.h2`
  margin-top: 0;
  font-size: 3rem;
  color: #707577;
`;

const Winners = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  min-width: 50vw;
`;

const Winner = styled.li`
  display: flex;
  justify-content: space-between;

  padding: 1.5vw 3vw;
  background: #cfd8dc;

  margin: 10px 0;
`;

const Name = styled.div`
  margin-right: 50px;

  color: #707577;
  font-size: 1.6rem;
`;

const Date = styled.div`
  color: #707577;
  font-size: 1.6rem;
`;

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
        <Date>{date}</Date>
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

export default LeaderBoard;
