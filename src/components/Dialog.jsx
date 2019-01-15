import React from 'react';
import { node } from 'prop-types';
import styled from 'styled-components';

import { getThemeValue, MAIN } from '../styles';

import Modal from './Modal';

const DialogWrapper = styled.div`
  background: ${getThemeValue(MAIN)};
  max-width: 90vw;
  max-height: 90vh;

  width: 30em;
  padding: 2em;
`;

export default function Dialog({ children }) {
  return (
    <Modal>
      <DialogWrapper>{children}</DialogWrapper>
    </Modal>
  );
}

Dialog.defaultProps = {
  children: null,
};

Dialog.propTypes = {
  children: node,
};
