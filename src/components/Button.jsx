import styled from 'styled-components';

const Button = styled.button.attrs((props) => ({
  type: 'button',
  children: props.text || props.children,
}))`
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 15px 25px;
  border: 0;

  font-size: 1.2rem;
  text-decoration: none;
  text-transform: uppercase;
  color: var(--primary2);
  background: var(--secondary2);
  border-radius: 10px;
  cursor: pointer;
`;

export default Button;
