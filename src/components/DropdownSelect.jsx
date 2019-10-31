/* eslint react/jsx-props-no-spreading: 0 */
import React from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import { useSelect } from 'downshift';

const Wrapper = styled.div`
  display: flex;
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
    transition: 0.2s;
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
`;

const Option = styled.li`
  padding: 10px;

  ${(props) => props.highlighted && css`
    color: #fff;
    background: #7a8c93;
  `}
`;

const DropdownSelect = ({
  options,
}) => {
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({ items: options });

  return (
    <Wrapper>
      <Button
        {...getToggleButtonProps()}
        expanded={isOpen}
      >
        {selectedItem ? selectedItem.label : 'Pick game mode'}
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
  options: [],
};

DropdownSelect.propTypes = {
  options: T.arrayOf(T.shape({
    value: T.string,
    label: T.string,
  })),
};

export default DropdownSelect;
