import React from 'react';
import styled, { css } from 'styled-components';
import {
  number,
  arrayOf,
  func,
} from 'prop-types';
import * as R from 'ramda';

const Canvas = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 70vw;
  min-width: 300px;
  max-width: 70vh;
  border: 1px solid #888;
`;

const Field = styled.button`
  width: ${({ width }) => width};
  padding-top: ${({ width }) => `calc(${width} - 2px)`};
  border: 1px solid #888;
  background: #fff;
  cursor: crosshair;

  ${({ isStepField }) => isStepField && css`
    background: #0fc9de;
  `}
  ${({ isComputerField }) => isComputerField && css`
    background: #993333;
  `}
  ${({ isUserField }) => isUserField && css`
    background: #339933;
  `}
`;

const GameCanvas = ({
  lineLength,
  fieldsCount,
  stepField,
  computerFields,
  userFields,
  onFieldClick,
}) => {
  const renderFields = R.pipe(
    R.range(0),
    R.map((field) => (
      <Field
        key={field}
        width={`${100 / lineLength}%`}
        onClick={() => onFieldClick(field)}
        isStepField={stepField === field}
        isComputerField={computerFields.includes(field)}
        isUserField={userFields.includes(field)}
      />
    )),
  );

  return (
    <Canvas>
      {renderFields(fieldsCount)}
    </Canvas>
  );
};

GameCanvas.defaultProps = {
  stepField: null,
};

GameCanvas.propTypes = {
  lineLength: number.isRequired,
  fieldsCount: number.isRequired,
  stepField: number,
  computerFields: arrayOf(number).isRequired,
  userFields: arrayOf(number).isRequired,
  onFieldClick: func.isRequired,
};

export default GameCanvas;
