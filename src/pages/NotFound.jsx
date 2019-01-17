import React from 'react';
import styled from 'styled-components';

import Title from '../styles/Title';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  flex-direction: column;
`;

export default function NotFound() {
  return (
    <Wrapper>
      <Title>404</Title>
      <Title>Not found</Title>
    </Wrapper>
  );
}
