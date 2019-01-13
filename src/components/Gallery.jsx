import React, { useContext } from 'react';
import { Grid } from 'react-virtualized';
import styled from 'styled-components';

import { API_IMAGES_PATH, SIZE_MAP, HIRES } from '../../shared/constants';
import { Window } from '../providers/WindowProvider';
import FlexContainer from '../styles/FlexContainer';

import Modal from './Modal';
import Picture from './Picture';

const SIZE = SIZE_MAP[HIRES];

const list = [
  ['Brian Vaughn', 'Software Engineer', 'San Jose', 'CA', 95125 /* ... */],
  // And so on...
];

const Container = styled(FlexContainer)`
  width: 100%;
  height: 100%;
`;

function cellRenderer({
  columnIndex,
  key,
  rowIndex,
  style,
  parent: {
    props: { data },
  },
}) {
  const post = data[columnIndex];

  const src = post.fake
    ? ''
    : `${API_IMAGES_PATH}/${SIZE}/${post.key.split('/')[1]}.webp`;

  return (
    <div key={key} style={style}>
      <Picture
        width="100%"
        ratio={1}
        src={src}
        shouldShowImage
        placeholderColor={post.placeholderColor}
      />
    </div>
  );
}

export default function Gallery({ data, index, onClose }) {
  const { height, width } = useContext(Window);
  const post = data[index];
  const ratio = data[index].imageHeight / data[index].imageWidth;
  if (Number(data[index].orientation) === 6) ratio = 1 / ratio;
  const src = post.fake
    ? ''
    : `${API_IMAGES_PATH}/${SIZE}/${post.key.split('/')[1]}.webp`;

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
        <Picture
          width="100%"
          ratio={ratio}
          src={src}
          shouldShowImage
          placeholderColor={post.placeholderColor}
        />
      </Container>
    </Modal>
  );
}
