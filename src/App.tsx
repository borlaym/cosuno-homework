import React from 'react';
import styled from '@emotion/styled'

const RootContainer = styled.div`
  padding: 50px 20px;
  margin: 20px;
  background: beige;
  color: black;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`

function App() {
  return (
    <RootContainer>
      <p>Hello</p>
    </RootContainer>
  );
}

export default App;
