import React, { useState, useEffect, useReducer } from 'react';
import styled from 'styled-components';
import preventDefault from '../../utils/preventDefault';

import gameReducer, {
  initialGameState,
  start,
  step,
  tryTakeCell,
  leave,
  GAME_STATUS,
} from './gameSlice';

import usePostWinner from './usePostWinner';
import useGameModes from './useGameModes';

import GameField from './GameField';

import {
  Main,
  DropdownSelect,
  Button,
  InputField,
  Loader,
} from '../../components';

const Game = () => {
  const [playerName, setPlayerName] = useState('');
  const [playerNameError, setPlayerNameError] = useState('');

  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);

  const {
    playerCells,
    computerCells,
    currentStepCell,
    status,
    message,
    winner,
  } = gameState;

  usePostWinner(winner);

  const { selectedGameMode, setSelectedGameMode, gameModes } = useGameModes();

  useEffect(() => {
    if (status !== GAME_STATUS.playing) {
      return;
    }

    const timerId = setInterval(() => {
      dispatch(step());
    }, selectedGameMode.delay);

    return () => clearInterval(timerId);
  }, [status]);

  const handleStartGame = () => {
    if (!playerName) {
      setPlayerNameError('Required');
      return;
    }

    dispatch(
      start({
        playerName,
        cellsCount: selectedGameMode.cellsCount,
      }),
    );
  };

  const handleLeaveGame = () => {
    dispatch(leave());
  };

  const handleRestartGame = () => {
    handleLeaveGame();
    handleStartGame();
  };

  const handleNameChange = (name) => {
    if (playerNameError) {
      setPlayerNameError('');
    }

    setPlayerName(name);
  };

  const handleModeChange = (mode) => {
    if (status === GAME_STATUS.finished) {
      handleLeaveGame();
    }

    setSelectedGameMode(mode);
  };

  const handleCellClick = (cell) => {
    dispatch(tryTakeCell(cell));
  };

  if (!selectedGameMode) {
    return <Loader />;
  }

  return (
    <Main>
      <Form onSubmit={preventDefault}>
        <ModeSelect
          selected={selectedGameMode}
          onSelect={handleModeChange}
          options={gameModes}
          disabled={status === GAME_STATUS.playing}
          placeholder="Pick game mode"
        />
        <NameInput
          value={playerName}
          onChange={handleNameChange}
          disabled={status === GAME_STATUS.playing}
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
        lineLength={selectedGameMode.lineLength}
        cellsCount={selectedGameMode.cellsCount}
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
  color: var(--secondary3);
  font-size: 1.6rem;
  line-height: 2rem;
`;

export default Game;
