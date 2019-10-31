import React from 'react';
import styled from 'styled-components';

import Game from './Game';

import {
  Main,
  DropdownSelect,
  Button,
} from '../components';

const Form = styled.form`
  display: flex;
`;

const Input = styled.input`
  padding: 15px 25px;
  margin: 0 10px;
  border: 2px solid #cfd8dc;
  background-color: #f3f3f3;
  font-size: 1.2rem;
  color: #707577;
  border-radius: 10px;
`;

const Message = styled.p`
  min-height: 1.6rem;
  margin: 20px;
  color: #99a6ab;
  font-size: 1.2rem;
  line-height: 1.6rem;
  
`;

const options = [
  {
    value: 'option1',
    label: 'option1',
  },
  {
    value: 'option2',
    label: 'option2',
  },
];

const GamePage = () => {
  const handleStartGame = (e) => {
    e.preventDefault();
  };

  return (
    <Main>
      <Form onSubmit={handleStartGame}>
        <DropdownSelect
          options={options}
        />
        <Input
          placeholder="Enter your name"
        />
        <Button
          type="submit"
        >
          Play
        </Button>
      </Form>
      <Message />
      <Game />
    </Main>
  );
};

export default GamePage;
