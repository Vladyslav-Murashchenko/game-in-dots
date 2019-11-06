import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;

  &::after {
    content: '';
    display: block;
    width: 200px;
    height: 200px;
    border-top: 50px solid #089bd4;
    border-left: 50px solid #d60152;
    border-right: 50px solid #16a953;
    border-bottom: 50px solid #d8e41b
    animation: 1s ${rotate} ease infinite;
  }
`;

export default Loader;
