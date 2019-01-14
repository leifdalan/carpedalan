import React from 'react';
import { arrayOf, func, number, shape } from 'prop-types';
import styled from 'styled-components';

import { HIRES, SIZE_MAP } from '../../shared/constants';
import FlexContainer from '../styles/FlexContainer';
import Title from '../styles/Title';
import { formatDate, getImagePath, getImageRatio } from '../utils';

import Modal from './Modal';
import Picture from './Picture';

const SIZE = SIZE_MAP[HIRES];

const Container = styled(FlexContainer)`
  width: 100%;
  height: 100%;
`;

const Inner = styled(FlexContainer)`
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const Caption = styled(FlexContainer)`
  justify-content: space-between;
  padding: 1em 1em;
  background: white;
  width: 100%;
  > * {
    padding: 0 1em;
  }
`;

const StyledTitle = styled(Title)`
  margin: 0;
`;

export default function Gallery({ data, index, onClose }) {
  const post = data[index];

  const ratio = getImageRatio(post);

  const src = getImagePath({ post, size: SIZE });

  return (
    <Modal>
      <Container onClick={onClose} alignItems="center" justifyContent="center">
        <Inner justifyContent="space-between">
          <Picture
            width="100%"
            ratio={ratio}
            src={src}
            shouldShowImage
            placeholderColor={post.placeholderColor}
          />
          <Caption justifyContent="space-between">
            <div>{post.description}</div>
            <StyledTitle size="small">{formatDate(post.timestamp)}</StyledTitle>
          </Caption>
        </Inner>
      </Container>
    </Modal>
  );
}

Gallery.propTypes = {
  data: arrayOf(shape({})).isRequired,
  index: number.isRequired,
  onClose: func.isRequired,
};
