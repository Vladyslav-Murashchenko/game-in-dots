/* eslint react/jsx-props-no-spreading: 0 */
import React, {
  useCallback,
} from 'react';
import styled, { css } from 'styled-components';
import {
  shape,
  arrayOf,
  string,
  func,
  bool,
} from 'prop-types';
import { useSelect } from 'downshift';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Button = styled.button.attrs({
  type: 'button',
})`
  position: relative;
  padding: 15px 30px 15px 25px;
  min-width: 220px;
  border: 0;

  font-size: 1.2rem;
  text-align: left;
  color: #83969b;
  background: #cfd8dc;
  border-radius: 10px;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    right: 15px;
    width: 12px;
    height: 12px;
    border-bottom: 3px solid #83969b;
    border-right: 3px solid #83969b;
    transition: 0.1s;
    transform: 
      ${({ expanded }) => (expanded ? 'translateY(8px)' : 'translateY(2px)')}
      rotate(45deg) 
      ${({ expanded }) => expanded && 'rotate(180deg)'};
  }
`;

const Menu = styled.ul`
  position: absolute;
  top: 60px;

  min-width: 100%;
  max-height: 200px;
  padding: 0;
  margin: 0;
  border-top: 0;
  
  list-style: none;
  overflow-y: auto;
  background: #fff;
  z-index: 1;
`;

const Option = styled.li`
  padding: 10px;
  cursor: pointer;

  ${(props) => props.highlighted && css`
    color: #fff;
    background: #7a8c93;
  `}
`;

const DropdownSelect = ({
  selected,
  options,
  onSelect,
  placeholder,
  disabled,
}) => {
  const handleSelect = useCallback(
    ({ selectedItem }) => onSelect(selectedItem),
    [onSelect],
  );

  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    items: options,
    onSelectedItemChange: handleSelect,
  });

  return (
    <Wrapper>
      <Button
        {...getToggleButtonProps()}
        expanded={isOpen}
        disabled={disabled}
      >
        {selected ? selected.label : placeholder}
      </Button>
      <Menu {...getMenuProps()}>
        {isOpen && options.map((option, index) => (
          <Option
            key={option.value}
            highlighted={highlightedIndex === index}
            {...getItemProps({ item: option, index })}
          >
            {option.label}
          </Option>
        ))}
      </Menu>
    </Wrapper>
  );
};

DropdownSelect.defaultProps = {
  selected: null,
  options: [],
  placeholder: '',
  disabled: false,
};

DropdownSelect.propTypes = {
  selected: shape({
    value: string,
    label: string,
  }),
  options: arrayOf(shape({
    value: string,
    label: string,
  })),
  onSelect: func.isRequired,
  placeholder: string,
  disabled: bool,
};

export default DropdownSelect;
