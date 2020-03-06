import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Picture from 'components/Picture';
import { PostsWithTagsWithFakes } from 'hooks/types';
import usePostLink from 'hooks/usePostLink';
import FlexContainer, { FlexEnums } from 'styles/FlexContainer';
import {
  BRAND_COLOR,
  formatDate,
  getThemeValue,
  TITLE_FONT,
  prop,
} from 'styles/utils';
import { getImageRatio, getOriginalImagePath } from 'utils';

const Description = styled.div`
  padding: 1em 1em 0;
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
  color: ${getThemeValue('neutralColor')};
`;

const Download = styled.a`
  color: ${getThemeValue(BRAND_COLOR)};
  font-family: ${getThemeValue(TITLE_FONT)};
  text-transform: uppercase;
  text-decoration: none;
`;

const Header = styled(FlexContainer)<{ width?: string }>`
  background-color: ${getThemeValue('main')};
  padding: 1em;
  width: ${prop('width')};
  align-self: center;
`;

const Article = styled.article`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  align-items: center;
`;

const Post = ({
  post,
  isSquare = false,
  width = '100%',
  safeRef,
  hasLink,
}: {
  post: PostsWithTagsWithFakes;
  isSquare?: boolean;
  width?: string;
  safeRef?: React.MutableRefObject<HTMLElement | null>;
  hasLink: boolean;
}) => {
  const { Element, props } = usePostLink({ post, hasLink });
  return (
    <Article>
      <Header
        width={width}
        ref={safeRef}
        as="header"
        justifyContent={FlexEnums.spaceBetween}
      >
        <Download data-test="date" as="div">
          {post.timestamp ? formatDate(post.timestamp) : null}
        </Download>
        <Download data-test="download" href={getOriginalImagePath({ post })}>
          Download
        </Download>
      </Header>
      <Element {...props}>
        <Picture
          width={width}
          ratio={isSquare ? 1 : getImageRatio(post)}
          post={post}
          shouldShowImage
          placeholderColor={post.placeholder}
          alt={post.description}
          type={isSquare ? 'square' : 'original'}
        />
      </Element>
      <Description>
        {post.description ? (
          <figcaption data-test="description">{post.description}</figcaption>
        ) : null}
        {post.tags && post.tags.length ? (
          <ul>
            {post.tags.map(({ name }) => (
              <li data-test="tags" key={name}>
                <StyledLink to={`/tag/${name}`}>{`#${name}`}</StyledLink>
              </li>
            ))}
          </ul>
        ) : null}
      </Description>
    </Article>
  );
};

export default Post;
