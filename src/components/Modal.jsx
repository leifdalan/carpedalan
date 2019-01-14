import React from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

import { document } from '../utils/globals';

const Background = styled.div`
  position: fixed;
  height: 100%;
  width: 100%;
  background: radial-gradient(
    ellipse at center,
    rgba(100, 100, 100, 0.5) 0%,
    rgba(0, 0, 0, 0.5) 100%
  ); /* w3c */
  z-index: 1;
  top: 0;
  left: 0;
`;

export default function Modal({ children }) {
  return createPortal(
    <Background>{children}</Background>,
    document.getElementById('modal'),
  );
}
