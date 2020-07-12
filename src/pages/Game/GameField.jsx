import React from 'react';
import styled, { css } from 'styled-components';
import { number, arrayOf, func } from 'prop-types';
import * as R from 'ramda';

const GameField = ({
  lineLength,
  cellsCount,
  stepCell,
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
        isStepCell={stepCell === cell}
        isComputerCell={computerCells.includes(cell)}
        isPlayerCell={playerCells.includes(cell)}
      />
    )),
  );

  return <Field>{renderCells(cellsCount)}</Field>;
};

GameField.defaultProps = {
  stepCell: null,
};

GameField.propTypes = {
  lineLength: number.isRequired,
  cellsCount: number.isRequired,
  stepCell: number,
  computerCells: arrayOf(number).isRequired,
  playerCells: arrayOf(number).isRequired,
  onCellClick: func.isRequired,
};

const Field = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  border: 1px solid #888;

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
  border: ${cellBorderWidth}px solid #888;
  background: #fff;
  cursor: crosshair;

  ${({ isStepCell }) =>
    isStepCell &&
    css`
      background: #0fc9de;
    `}
  ${({ isComputerCell }) =>
    isComputerCell &&
    css`
      background: #993333;
    `}
  ${({ isPlayerCell }) =>
    isPlayerCell &&
    css`
      background: #339933;
    `}
`;

export default GameField;
