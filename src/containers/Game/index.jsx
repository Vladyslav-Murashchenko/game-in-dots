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
import {
  dateFormatter,
  preventDefault,
} from '../../utils';
import gameReducer, {
  initialGameState,
  gameActions,
} from './gameReducer';

import GameField from '../GameField';

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

  const timerRef = useRef(null);

  const {
    playerCells,
    computerCells,
    stepCell,
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

    return () => clearTimeout(timerRef.current);
  }, [stepCell, isPlaying]);

  const lineLength = selectedMode && settings[selectedMode.value].field;
  const cellsCount = lineLength && lineLength ** 2;

  const handleNameChange = (e) => {
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

    gameDispatch(gameActions.start(cellsCount, playerName));
  };

  const handleLeaveGame = () => {
    gameDispatch(gameActions.leave());
    clearTimeout(timerRef.current);
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
        <DropdownSelectStyled
          selected={selectedMode}
          onSelect={R.pipe(setSelectedMode, handleLeaveGame)}
          options={modeOptions}
          disabled={isPlaying}
          placeholder="Pick game mode"
        />
        <InputFieldStyled
          value={playerName}
          onChange={handleNameChange}
          disabled={isPlaying}
          placeholder="Enter your name"
          error={playerNameError}
        />
        {!isPlaying && stepCell == null && (
          <Button
            text="Play"
            onClick={handleStartGame}
          />
        )}
        {!isPlaying && stepCell != null && (
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
      <GameField
        lineLength={lineLength}
        cellsCount={cellsCount}
        stepCell={stepCell}
        onCellClick={handleCellClick}
        playerCells={playerCells}
        computerCells={computerCells}
      />
    </Main>
  );
};

const DropdownSelectStyled = styled(DropdownSelect)`
  margin-bottom: 1.5rem;

  @media (min-width: 800px) {
    margin: 0;
  }
`;

const InputFieldStyled = styled(InputField)`
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
