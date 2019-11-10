import styled from 'styled-components';

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: 3vw;

  @media (max-width: 800px) {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
  }
`;

export default Main;
