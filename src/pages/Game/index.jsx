import React, { useState, useMemo, useEffect, useReducer, useRef } from 'react';
import styled from 'styled-components';
import * as R from 'ramda';
import { titleCase } from 'change-case';

import * as api from '../../api';
import { dateFormatter, preventDefault } from '../../utils';
import gameReducer, {
  initialGameState,
  gameActions,
  GAME_STATUS,
} from './gameReducer';

import GameField from './GameField';

import {
  Main,
  DropdownSelect,
  Button,
  InputField,
  Loader,
} from '../../components';

const Game = () => {
  const [settings, setSettings] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);

  const [playerName, setPlayerName] = useState('');
  const [playerNameError, setPlayerNameError] = useState('');

  const [gameState, gameDispatch] = useReducer(gameReducer, initialGameState);

  const {
    playerCells,
    computerCells,
    currentStepCell,
    status,
    message,
    winner,
  } = gameState;

  useEffect(() => {
    api.fetchGameSettings().then(setSettings);
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
    if (status !== GAME_STATUS.playing) {
      return;
    }

    const { delay } = settings[selectedMode.value];

    const timerId = setInterval(() => {
      gameDispatch(gameActions.step());
    }, delay);

    return () => clearInterval(timerId);
  }, [status]);

  const lineLength = selectedMode && settings[selectedMode.value].field;
  const cellsCount = lineLength && lineLength ** 2;

  const handleNameChange = (name) => {
    if (playerNameError) {
      setPlayerNameError('');
    }

    setPlayerName(name);
  };

  const handleStartGame = () => {
    if (!playerName) {
      setPlayerNameError('Required');
      return;
    }

    gameDispatch(gameActions.start(cellsCount, playerName));
  };

  const handleLeaveGame = () => {
    gameDispatch(gameActions.leave());
  };

  const handleRestartGame = () => {
    handleLeaveGame();
    handleStartGame();
  };

  const handleCellClick = (cell) => {
    gameDispatch(gameActions.cellClick(cell));
  };

  if (!selectedMode) {
    return <Loader />;
  }

  return (
    <Main>
      <Form onSubmit={preventDefault}>
        <ModeSelect
          selected={selectedMode}
          onSelect={setSelectedMode}
          options={modeOptions}
          disabled={status !== GAME_STATUS.preparing}
          placeholder="Pick game mode"
        />
        <NameInput
          value={playerName}
          onChange={handleNameChange}
          disabled={status !== GAME_STATUS.preparing}
          placeholder="Enter your name"
          error={playerNameError}
        />
        {status === GAME_STATUS.preparing && (
          <Button text="Play" onClick={handleStartGame} />
        )}
        {status === GAME_STATUS.finished && (
          <Button text="Play Again" onClick={handleRestartGame} />
        )}
        {status === GAME_STATUS.playing && (
          <Button text="Leave" onClick={handleLeaveGame} />
        )}
      </Form>
      <Message>{message}</Message>
      <GameField
        lineLength={lineLength}
        cellsCount={cellsCount}
        currentStepCell={currentStepCell}
        onCellClick={handleCellClick}
        playerCells={playerCells}
        computerCells={computerCells}
      />
    </Main>
  );
};

const ModeSelect = styled(DropdownSelect)`
  margin-bottom: 1.5rem;

  @media (min-width: 800px) {
    margin: 0;
  }
`;

const NameInput = styled(InputField)`
  margin-bottom: 1.5rem;

  @media (min-width: 800px) {
    margin: 0 10px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;

  @media (min-width: 800px) {
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
`;

const Message = styled.p`
  min-height: 1.6rem;
  margin: 20px auto;
  color: #99a6ab;
  font-size: 1.6rem;
  line-height: 2rem;
`;

export default Game;
