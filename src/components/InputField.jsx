import React from 'react';
import styled from 'styled-components';
import { string, func, bool } from 'prop-types';

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
      onChange={(e) => onChange(e.target.value)}
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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Input = styled.input`
  padding: 13px 25px;
  border: 2px solid
    ${({ hasError }) => (hasError ? 'var(--secondary6)' : 'var(--secondary4)')};
  background-color: var(--secondary1);
  font-size: 1.2rem;
  color: var(--primary1);
  border-radius: 10px;
`;

const Error = styled.p`
  position: absolute;
  color: var(--secondary6);
  margin: 0;
  top: -20px;
  left: 5px;
`;

export default InputField;
