import debug from 'debug';
import React, { useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import GalleryPost from 'components/GalleryPost';
import Modal from 'components/Modal';
import { PostsWithTagsWithFakes } from 'hooks/types';
import useWindow from 'hooks/useWindow';
import FlexContainer, { FlexEnums } from 'styles/FlexContainer';
import { getImageRatio } from 'utils';

const log = debug('components:Gallery');

const { center } = FlexEnums;

const Container = styled(FlexContainer)`
  width: 100%;
  height: 100%;
`;

const Gallery = ({ posts }: { posts: PostsWithTagsWithFakes[] }) => {
  const { width, height } = useWindow();
  const safeRef = useRef(null);
  const params = useParams();

  const navigate = useNavigate();
  const location = useLocation();

  const post = posts.find(({ id }) => params.postId === id?.split('-')[0]);
  const onClose = () => {
    const routeWithoutGallery =
      location.pathname.replace(`/${params['*']}`, '') || '/';
    log('route', routeWithoutGallery);
    navigate(`${routeWithoutGallery}${location.hash}`);
  };

  if (!post) {
    onClose();
    return null;
  }
  const viewPortAspectRatio = height / width;

  const photoAspectRatio = getImageRatio(post);

  const photoWidth =
    photoAspectRatio > viewPortAspectRatio
      ? `${height / photoAspectRatio - 100}px`
      : '100%';

  return (
    <Modal onClose={onClose} safeRef={safeRef}>
      <Container alignItems={center} justifyContent={center}>
        <GalleryPost
          hasLink={false}
          safeRef={safeRef}
          post={post}
          width={photoWidth}
          posts={posts}
        />
      </Container>
    </Modal>
  );
};

export default Gallery;
