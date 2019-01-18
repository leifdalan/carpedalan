import React from 'react';
import { node, oneOf } from 'prop-types';
import styled, { css } from 'styled-components';

import { getThemeValue, MAIN } from '../styles';

import Modal from './Modal';

const DialogWrapper = styled.div`
  background: ${getThemeValue(MAIN)};
  max-width: 90vw;
  max-height: 90vh;
  padding: 2em;
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

export default function Dialog({ children, type }) {
  return (
    <Modal>
      <DialogWrapper type={type}>{children}</DialogWrapper>
    </Modal>
  );
}

Dialog.defaultProps = {
  children: null,
  type: 'normal',
};

Dialog.propTypes = {
  children: node,
  type: oneOf(['normal, wide']),
};
