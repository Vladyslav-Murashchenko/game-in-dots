import React from 'react';
import styled, { css } from 'styled-components';
import { number, arrayOf, func } from 'prop-types';
import * as R from 'ramda';

const GameField = ({
  lineLength,
  cellsCount,
  currentStepCell,
  computerCells,
  playerCells,
  onCellClick,
}) => {
  const renderCells = R.pipe(
    R.range(0),
    R.map((cell) => (
      <Cell
        key={cell}
        width={`${100 / lineLength}%`}
        onMouseDown={() => onCellClick(cell)}
        onTouchStart={() => onCellClick(cell)}
        isCurrentStepCell={currentStepCell === cell}
        isComputerCell={computerCells.includes(cell)}
        isPlayerCell={playerCells.includes(cell)}
      />
    )),
  );

  return <Field>{renderCells(cellsCount)}</Field>;
};

GameField.defaultProps = {
  currentStepCell: null,
};

GameField.propTypes = {
  lineLength: number.isRequired,
  cellsCount: number.isRequired,
  currentStepCell: number,
  computerCells: arrayOf(number).isRequired,
  playerCells: arrayOf(number).isRequired,
  onCellClick: func.isRequired,
};

const Field = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  border: 1px solid var(--secondary3);

  @media (min-width: 800px) {
    width: 70vw;
    max-width: 70vh;
  }
`;

const cellBorderWidth = 1;

const Cell = styled.button`
  width: ${({ width }) => width};
  padding: 0;
  padding-top: ${({ width }) => `calc(${width} - ${cellBorderWidth * 2}px)`};
  border: ${cellBorderWidth}px solid var(--secondary3);
  background: var(--primary2);
  cursor: crosshair;

  ${({ isCurrentStepCell }) =>
    isCurrentStepCell &&
    css`
      background: var(--secondary5);
    `}
  ${({ isComputerCell }) =>
    isComputerCell &&
    css`
      background: var(--secondary6);
    `}
  ${({ isPlayerCell }) =>
    isPlayerCell &&
    css`
      background: var(--secondary7);
    `}
`;

export default GameField;
