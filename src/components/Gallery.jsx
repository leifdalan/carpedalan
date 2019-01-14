import React from 'react';
import styled from 'styled-components';

import { HIRES, SIZE_MAP } from '../../shared/constants';
import FlexContainer from '../styles/FlexContainer';
import Title from '../styles/Title';
import { formatDate, getImagePath } from '../utils';

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
  let ratio = data[index].imageHeight / data[index].imageWidth;
  if (Number(data[index].orientation) === 6) ratio = 1 / ratio;

  const src = getImagePath({ post, size: SIZE });

  return (
    <Modal>
      {/* <Grid
        autoHeight
        // autoWidth
        cellRenderer={cellRenderer}
        columnCount={data.length}
        columnWidth={width}
        height={height}
        rowCount={1}
        rowHeight={500}
        width={width}
        data={data}
        index={index}
      /> */}
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
