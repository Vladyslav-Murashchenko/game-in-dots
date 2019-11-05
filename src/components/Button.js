import styled from 'styled-components';

const Button = styled.button.attrs((props) => ({
  type: 'button',
  children: props.text || props.children,
}))`
  padding: 15px 25px;
  border: 0;

  font-size: 1.2rem;
  text-decoration: none;
  text-transform: uppercase;
  color: #ffffff;
  background: #7a8c93;
  border-radius: 10px;
  cursor: pointer;
`;

export default Button;
