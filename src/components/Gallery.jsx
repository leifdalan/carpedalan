import React, { useContext } from 'react';
import { arrayOf, shape } from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import NotFound from '../pages/NotFound';
import { Window } from '../providers/WindowProvider';
import { BRAND_COLOR, getThemeValue, prop, TITLE_FONT } from '../styles';
import FlexContainer from '../styles/FlexContainer';
import Title from '../styles/Title';
import { formatDate, getImageRatio, getOriginalImagePath } from '../utils';

import Modal from './Modal';
import Picture from './Picture';

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
  width: ${prop('width')};
  flex-direction: column;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${getThemeValue(BRAND_COLOR)};
`;

const StyledTitle = styled(Title)`
  margin: 0;
`;

const Download = styled.a`
  color: ${getThemeValue(BRAND_COLOR)};
  font-family: ${getThemeValue(TITLE_FONT)};
  text-transform: uppercase;
  text-decoration: none;
`;

const Row = styled(FlexContainer)`
  justify-content: space-between;
  width: 100%;
  li {
    list-style: none;
    padding: 0;
    display: inline-block;
    margin-right: 0.25em;
  }
  ul {
    margin: 0;
    padding: 0;
  }
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
      ? `${height / photoAspectRatio - 50}px`
      : 'calc(100% - 50px)';

  return (
    <Link to={{ pathname: match.params[0] || '/', hash: location.hash }}>
      <Modal>
        <Container alignItems="center" justifyContent="center">
          <Inner justifyContent="space-between">
            {!post ? (
              <NotFound />
            ) : (
              <>
                <Picture
                  width={photoWidth}
                  ratio={getImageRatio(post)}
                  post={post}
                  shouldShowImage
                  placeholderColor={post.placeholderColor}
                />
                <Caption width={photoWidth} justifyContent="space-between">
                  <Row justifyContent="space-between">
                    <div>{post.description}</div>
                    <StyledTitle size="small">
                      {formatDate(post.timestamp)}
                    </StyledTitle>
                  </Row>
                  <Row justifyContent="space-between">
                    {post.tags && post.tags.length ? (
                      <ul>
                        {/* eslint-disable react/no-array-index-key */}
                        {post.tags.map(({ name }, tagIndex) => (
                          <li key={tagIndex}>
                            <StyledLink to={`/tag/${name}`}>
                              {`#${name}`}
                            </StyledLink>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    <Download href={getOriginalImagePath({ post })}>
                      Download
                    </Download>
                  </Row>
                </Caption>
              </>
            )}
          </Inner>
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
