import React, { useRef } from 'react';
import { node, oneOf, func } from 'prop-types';
import styled, { css } from 'styled-components';

import { getThemeValue, MAIN } from '../styles';

import Modal from './Modal';

const DialogWrapper = styled.div`
  background: ${getThemeValue(MAIN)};
  max-width: 90vw;
  max-height: 90vh;
  padding: 2em;
  overflow: auto;
  ${({ type }) => {
    switch (type) {
      case 'wide':
        return css`
          width: 75vw;
        `;
      default:
        return null;
    }
  }}
`;

DialogWrapper.defaultProps = {
  type: 'normal',
};

export default function Dialog({ children, type, onClose }) {
  const safeRef = useRef();
  return (
    <Modal onClose={onClose} safeRef={safeRef}>
      <DialogWrapper ref={safeRef} type={type}>
        {children}
      </DialogWrapper>
    </Modal>
  );
}

Dialog.defaultProps = {
  onClose: () => {},
  children: null,
  type: 'normal',
};

Dialog.propTypes = {
  children: node,
  onClose: func,
  type: oneOf(['normal, wide']),
};
