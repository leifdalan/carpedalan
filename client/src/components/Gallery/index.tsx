import debug from 'debug';
import React, { useRef, useContext } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import GalleryPost from 'components/GalleryPost';
import Modal from 'components/Modal';
import useWindow from 'hooks/useWindow';
import { DataContext } from 'providers/Data';
import FlexContainer, { FlexEnums } from 'styles/FlexContainer';
import { getImageRatio } from 'utils';

const log = debug('components:Gallery');

const { center } = FlexEnums;

const Container = styled(FlexContainer)`
  width: 100%;
  height: 100%;
`;

const Gallery: React.FC = () => {
  const { width, height } = useWindow();
  const safeRef = useRef(null);
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    data: { postsById },
  } = useContext(DataContext);

  const postId = Object.keys(postsById).find(id => {
    if (id) {
      return id.split('-')[0] === params.postId;
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

  const onClose = () => {
    const routeWithoutGallery = location.pathname
      .replace(`/${params.postId}`, '')
      .replace('/gallery', '');
    log('route', routeWithoutGallery);
    navigate(`${routeWithoutGallery || '/'}${location.hash}`);
  };

  return (
    <Modal onClose={onClose} safeRef={safeRef}>
      <Container alignItems={center} justifyContent={center}>
        <GalleryPost
          hasLink={false}
          safeRef={safeRef}
          post={post}
          width={photoWidth}
        />
      </Container>
    </Modal>
  );
};

export default Gallery;
