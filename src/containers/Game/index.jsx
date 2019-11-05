import React, {
  useState,
  useMemo,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import styled from 'styled-components';
import * as R from 'ramda';
import { titleCase } from 'change-case';

import * as api from '../../api';
import gameReducer, {
  initialGameState,
  gameActions,
} from './gameReducer';

import GameCanvas from '../GameCanvas';

import {
  Main,
  DropdownSelect,
  Button,
} from '../../components';

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

const Game = () => {
  const [settings, setSettings] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  const [gameState, gameDispatch] = useReducer(gameReducer, initialGameState);

  const timerRef = useRef(null);

  const {
    userFields,
    computerFields,
    stepField,
    isPlaying,
    message,
  } = gameState;

  useEffect(() => {
    api.fetchGameSettings()
      .then(setSettings);
  }, []);

  const modeOptions = useMemo(() => {
    const getModeOptions = R.pipe(
      R.keys,
      R.map((value) => ({
        value,
        label: titleCase(value),
      })),
    );

    return getModeOptions(settings);
  }, [settings]);

  useEffect(() => {
    setSelectedMode(R.head(modeOptions));
  }, [modeOptions]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const { delay } = settings[selectedMode.value];

    timerRef.current = setTimeout(R.pipe(
      gameActions.step,
      gameDispatch,
    ), delay);

    // eslint-disable-next-line consistent-return
    return () => clearTimeout(timerRef.current);
  }, [stepField, isPlaying]);

  const lineLength = selectedMode && settings[selectedMode.value].field;
  const fieldsCount = lineLength && lineLength ** 2;

  const handleStartGame = () => {
    gameDispatch(gameActions.start(fieldsCount));
  };

  const handleLeaveGame = () => {
    gameDispatch(gameActions.leave());
    clearTimeout(timerRef.current);
  };

  const handleUserCatchField = (field) => {
    gameDispatch(gameActions.userCatchField(field));
  };

  return (
    <Main>
      <Form>
        <DropdownSelect
          selected={selectedMode}
          onSelect={setSelectedMode}
          options={modeOptions}
          placeholder="Pick game mode"
        />
        <Input
          placeholder="Enter your name"
        />
        {!isPlaying && stepField == null && (
          <Button
            text="Play"
            onClick={handleStartGame}
          />
        )}
        {!isPlaying && stepField != null && (
          <Button
            text="Play Again"
            onClick={R.pipe(handleLeaveGame, handleStartGame)}
          />
        )}
        {isPlaying && (
          <Button
            text="Leave"
            onClick={handleLeaveGame}
          />
        )}
      </Form>
      <Message>{message}</Message>
      {selectedMode && (
        <GameCanvas
          lineLength={lineLength}
          fieldsCount={fieldsCount}
          stepField={stepField}
          onFieldClick={handleUserCatchField}
          userFields={userFields}
          computerFields={computerFields}
        />
      )}
    </Main>
  );
};

export default Game;
