import React from 'react';
import styled from 'styled-components';
import {
  string,
  func,
  bool,
} from 'prop-types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Input = styled.input`
  padding: 15px 25px;
  border: 2px solid ${({ hasError }) => (hasError ? '#993333' : '#cfd8dc')};
  background-color: #f3f3f3;
  font-size: 1.2rem;
  color: #707577;
  border-radius: 10px;
`;

const Error = styled.p`
  position: absolute;
  color: #993333;
  margin: 0;
  top: -20px;
  left: 5px;
`;

const InputField = ({
  value,
  onChange,
  disabled,
  placeholder,
  error,
  className,
}) => (
  <Wrapper className={className}>
    <Input
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      hasError={error}
    />
    <Error>{error}</Error>
  </Wrapper>
);

InputField.defaultProps = {
  error: '',
  disabled: false,
  placeholder: '',
  className: '',
};

InputField.propTypes = {
  value: string.isRequired,
  onChange: func.isRequired,
  error: string,
  disabled: bool,
  placeholder: string,
  className: string,
};

export default InputField;
