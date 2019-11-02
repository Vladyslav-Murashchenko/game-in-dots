import React from 'react';
import styled from 'styled-components';
import {
  number,
  arrayOf,
} from 'prop-types';
import * as R from 'ramda';

const Canvas = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 60vh;
`;

const Field = styled.button`
  width: ${({ width }) => width};
  padding-top: ${({ width }) => `calc(${width} - 2px)`};
  border: 1px solid #333;
  cursor: crosshair;
`;

const GameCanvas = ({
  lineLength,
  fieldsCount,
  stepField,
  computerFields,
  userFields,
}) => {
  const renderFields = R.pipe(
    R.times(R.identity),
    R.map((fieldIndex) => (
      <Field
        key={fieldIndex}
        width={`${100 / lineLength}%`}
        onClick={() => console.log('fieldClick')}
        isStepField={stepField === fieldIndex}
        isComputerField={computerFields.includes(fieldIndex)}
        isUserField={userFields.includes(fieldIndex)}
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
};

export default GameCanvas;
