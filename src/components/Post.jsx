import React from 'react';
import { bool, shape, string } from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { BRAND_COLOR, getThemeValue, MAIN, prop, TITLE_FONT } from '../styles';
import Flex from '../styles/FlexContainer';
import { formatDate, getImageRatio, getOriginalImagePath } from '../utils';

import Picture from './Picture';

const Download = styled.a`
  color: ${getThemeValue(BRAND_COLOR)};
  font-family: ${getThemeValue(TITLE_FONT)};
  text-transform: uppercase;
  text-decoration: none;
`;

const Description = styled.div`
  padding: 1em 1em;
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

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${getThemeValue(BRAND_COLOR)};
`;

const Header = styled(Flex)`
  padding: 1em;
`;

const PostContainer = styled.div`
  width: ${prop('width')};
  position: relative;
  background-color: ${getThemeValue(MAIN)};
`;

export default function Post({
  post,
  shouldShowImages,
  width,
  // umnm
}) {
  return (
    <PostContainer width={width}>
      <Header justifyContent="space-between">
        <Download as="div">{formatDate(post.timestamp)}</Download>
        <Download
          onClick={e => e.stopPropagation()}
          href={getOriginalImagePath({ post })}
        >
          Download
        </Download>
      </Header>

      <Picture
        width="100%"
        ratio={getImageRatio(post)}
        post={post}
        shouldShowImage={shouldShowImages}
        placeholderColor={post.placeholderColor}
        alt={post.description}
      />
      {post.description || (post.tags && post.tags.length) ? (
        <Description>
          {post.description ? (
            <figcaption>{post.description}</figcaption>
          ) : null}
          {post.tags && post.tags.length ? (
            <ul>
              {/* eslint-disable react/no-array-index-key */}
              {post.tags.map(({ name }, tagIndex) => (
                <li key={tagIndex}>
                  <StyledLink to={`/tag/${name}`}>{`#${name}`}</StyledLink>
                </li>
              ))}
            </ul>
          ) : null}
        </Description>
      ) : null}
    </PostContainer>
  );
}

Post.propTypes = {
  post: shape({}).isRequired,
  shouldShowImages: bool.isRequired,
  width: string.isRequired,
};
