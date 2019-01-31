import React, { useContext } from 'react';
import { arrayOf, shape } from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import NotFound from '../pages/NotFound';
import { Window } from '../providers/WindowProvider';
import FlexContainer from '../styles/FlexContainer';
import { getImageRatio } from '../utils';

import Modal from './Modal';
import Post from './Post';

const Container = styled(FlexContainer)`
  width: 100%;
  height: 100%;
`;

export default function Gallery({ match, data, location }) {
  // console.error('props', props);
  const { width, height } = useContext(Window);
  if (!data.length) return null;

  const post = data.find(
    ({ id }) => id && id.split('-')[0] === match.params.id,
  );

  const viewPortAspectRatio = height / width;

  const photoAspectRatio = getImageRatio(post);

  const photoWidth =
    photoAspectRatio > viewPortAspectRatio
      ? `${height / photoAspectRatio - 100}px`
      : 'calc(100%)';

  return (
    <Link to={{ pathname: match.params[0] || '/', hash: location.hash }}>
      <Modal>
        <Container alignItems="center" justifyContent="center">
          {/* <Inner justifyContent="space-between"> */}
          {!post ? (
            <NotFound />
          ) : (
            <Post post={post} shouldShowImages tags={[]} width={photoWidth} />
          )}
          {/* </Inner> */}
        </Container>
      </Modal>
    </Link>
  );
}

Gallery.propTypes = {
  data: arrayOf(shape({})).isRequired,
  match: shape({}).isRequired,
  location: shape({}).isRequired,
};
