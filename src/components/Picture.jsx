import React from 'react';
import { bool, func, node, number, oneOf, shape, string } from 'prop-types';
import styled from 'styled-components';

import { getFullImageSrcSet, getSquareImageSrcSet } from '../utils';

// import { propTrueFalse } from '../styles';

const Wrapper = styled.div`
  display: inline-block;
  margin-bottom: -4px;
`;

const StyledPicture = styled.picture`
  position absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  img {
      position absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  }
`;

StyledPicture.defaultProps = {
  loaded: false,
};

const Picture = ({
  shouldShowImage,
  width,
  ratio,
  post,
  placeholderColor,
  alt,
  children,
  type,
  ...etc
}) => (
  <Wrapper
    style={{
      position: 'relative',
      width,
    }}
    {...etc}
  >
    <div
      className="image"
      style={{
        paddingTop: `${ratio * 100}%`,
        position: 'relative',
        backgroundColor: placeholderColor,
      }}
    >
      {shouldShowImage && !post.fake ? (
        <StyledPicture as="picture" data-test={post.key}>
          {type === 'original'
            ? getFullImageSrcSet({ post })
            : getSquareImageSrcSet({ post })}
        </StyledPicture>
      ) : null}
      {children}
    </div>
  </Wrapper>
);

Picture.defaultProps = {
  shouldShowImage: true,
  alt: undefined,
  onClick: () => {},
  children: null,
  type: 'original',
};

Picture.propTypes = {
  children: node,
  shouldShowImage: bool,
  ratio: number.isRequired,
  width: string.isRequired,
  placeholderColor: string.isRequired,
  alt: string,
  onClick: func,
  post: shape({
    height: number,
    width: number,
    fake: bool,
  }).isRequired,
  type: oneOf(['original', 'square']),
};

export default Picture;
