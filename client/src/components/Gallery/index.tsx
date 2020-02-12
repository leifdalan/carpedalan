import debug from 'debug';
import React, { useRef, useContext, MouseEvent } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';

import useWindow from 'hooks/useWindow';
import { DataContext } from 'providers/Data';
import FlexContainer, { FlexEnums } from 'styles/FlexContainer';

import { getImageRatio } from '../../utils';
import Modal from '../Modal';
import Post from '../Post';

const log = debug('components:Gallery');

const { center } = FlexEnums;

const Container = styled(FlexContainer)`
  width: 100%;
  height: 100%;
`;

type GalleryI = RouteComponentProps<{ postId: string }>;

const Gallery: React.FC<GalleryI> = ({ match, history, location }) => {
  const { width, height } = useWindow();
  const safeRef = useRef(null);

  const {
    data: { postsById },
  } = useContext(DataContext);
  log('posts', postsById);

  const postId = Object.keys(postsById).find(id => {
    if (id) {
      return id.split('-')[0] === match.params.postId;
    }
    return false;
  });

  if (!postId) return null;

  const post = postsById[postId];

  const viewPortAspectRatio = height / width;

  const photoAspectRatio = getImageRatio(post);

  const photoWidth =
    photoAspectRatio > viewPortAspectRatio
      ? `${height / photoAspectRatio - 100}px`
      : '100%';

  const onClose = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();

    const routeWithoutGallery = location.pathname
      .replace(`/${match.params.postId}`, '')
      .replace('/gallery', '');
    log('route', routeWithoutGallery);
    history.push(`${routeWithoutGallery || '/'}${location.hash}`);
  };

  return (
    <Modal onClose={onClose} safeRef={safeRef}>
      <Container alignItems={center} justifyContent={center}>
        <Post safeRef={safeRef} post={post} width={photoWidth} />
      </Container>
    </Modal>
  );
};

export default Gallery;
