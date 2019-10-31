import React, {
  useState,
  useMemo,
  useEffect,
} from 'react';
import styled from 'styled-components';
import { titleCase } from 'change-case';

import * as api from '../api';

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

const GamePage = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.fetchGameSettings()
      .then(setSettings);
  }, []);

  const modeOptions = useMemo(() => {
    if (!settings) {
      return [];
    }

    return Object.keys(settings).map((value) => ({
      value,
      label: titleCase(value),
    }));
  }, [settings]);

  const handleStartGame = (e) => {
    e.preventDefault();
  };

  return (
    <Main>
      <Form onSubmit={handleStartGame}>
        <DropdownSelect
          options={modeOptions}
          placeholder="Pick game mode"
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
