import React from 'react';
import styled, { css } from 'styled-components';
import {
  number,
  arrayOf,
  func,
} from 'prop-types';
import * as R from 'ramda';

const Field = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 70vw;
  max-width: 70vh;
  border: 1px solid #888;

  @media (max-width: 800px) {
    width: 100%;
    max-width: 90vh;
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

  ${({ isStepCell }) => isStepCell && css`
    background: #0fc9de;
  `}
  ${({ isComputerCell }) => isComputerCell && css`
    background: #993333;
  `}
  ${({ isPlayerCell }) => isPlayerCell && css`
    background: #339933;
  `}
`;

const Game = ({
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
        onClick={() => onCellClick(cell)}
        isStepCell={stepCell === cell}
        isComputerCell={computerCells.includes(cell)}
        isPlayerCell={playerCells.includes(cell)}
      />
    )),
  );

  return (
    <Field>
      {renderCells(cellsCount)}
    </Field>
  );
};

Game.defaultProps = {
  stepCell: null,
};

Game.propTypes = {
  lineLength: number.isRequired,
  cellsCount: number.isRequired,
  stepCell: number,
  computerCells: arrayOf(number).isRequired,
  playerCells: arrayOf(number).isRequired,
  onCellClick: func.isRequired,
};

export default Game;