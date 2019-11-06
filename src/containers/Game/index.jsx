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

import { dateFormatter } from '../../utils';
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
  InputField,
  Loader,
} from '../../components';

const InputFieldStyled = styled(InputField)`
  margin: 0 10px;
`;

const Form = styled.form`
  display: flex;
`;

const Message = styled.p`
  min-height: 1.6rem;
  margin: 20px;
  color: #99a6ab;
  font-size: 1.6rem;
  line-height: 2rem;
`;

const Game = () => {
  const [settings, setSettings] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);

  const [playerName, setPlayerName] = useState('');
  const [playerNameError, setPlayerNameError] = useState('');

  const [gameState, gameDispatch] = useReducer(gameReducer, initialGameState);

  const timerRef = useRef(null);

  const {
    playerFields,
    computerFields,
    stepField,
    isPlaying,
    message,
    winner,
  } = gameState;

  useEffect(() => {
    api.fetchGameSettings()
      .then(setSettings);
  }, []);

  useEffect(() => {
    if (!winner) {
      return;
    }

    const date = dateFormatter.format(new Date());

    api.postWinner(winner, date);
  }, [winner]);

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

  const handleFieldChange = (e) => {
    if (playerNameError) {
      setPlayerNameError('');
    }

    setPlayerName(e.target.value);
  };

  const handleStartGame = () => {
    if (!playerName) {
      setPlayerNameError('Required');
      return;
    }

    gameDispatch(gameActions.start(fieldsCount, playerName));
  };

  const handleLeaveGame = () => {
    gameDispatch(gameActions.leave());
    clearTimeout(timerRef.current);
  };

  const handleCatchField = (field) => {
    gameDispatch(gameActions.catchField(field));
  };

  if (!selectedMode) {
    return <Loader />;
  }

  return (
    <Main>
      <Form>
        <DropdownSelect
          selected={selectedMode}
          onSelect={R.pipe(setSelectedMode, handleLeaveGame)}
          options={modeOptions}
          disabled={isPlaying}
          placeholder="Pick game mode"
        />
        <InputFieldStyled
          value={playerName}
          onChange={handleFieldChange}
          disabled={isPlaying}
          placeholder="Enter your name"
          error={playerNameError}
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
      <GameCanvas
        lineLength={lineLength}
        fieldsCount={fieldsCount}
        stepField={stepField}
        onFieldClick={handleCatchField}
        playerFields={playerFields}
        computerFields={computerFields}
      />
    </Main>
  );
};

export default Game;
