import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

import FlexContainer from '../styles/FlexContainer';
import { document } from '../utils/globals';

const Background = styled(FlexContainer)`
  justify-content: center;
  align-items: center;
  position: fixed;
  height: 100%;
  width: 100%;
  background: radial-gradient(
    ellipse at center,
    rgba(100, 100, 100, 0.8) 0%,
    rgba(0, 0, 0, 0.8) 100%
  ); /* w3c */
  z-index: 1;
  top: 0;
  left: 0;
`;

export default function Modal({ children }) {
  useEffect(() => {
    document.getElementsByTagName('body')[0].classList.add('show-modal');
    return () => {
      document.getElementsByTagName('body')[0].classList.remove('show-modal');
    };
  }, []);
  return createPortal(
    <Background>{children}</Background>,
    document.getElementById('modal'),
  );
}
