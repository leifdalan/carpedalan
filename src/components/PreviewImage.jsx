import React from 'react';
import { bool, func, node, number, oneOf, shape, string } from 'prop-types';
import styled from 'styled-components';

// import { propTrueFalse } from '../styles';

const Wrapper = styled.div`
  display: inline-block;
  margin-bottom: -4px;
`;

const Img = styled.img`
  position absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  }
`;

const Picture = ({
  shouldShowImage,
  width,
  ratio,
  post,
  placeholderColor,
  src,
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
    className="preview"
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
      <Img src={src} />
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
  src: string.isRequired,
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
