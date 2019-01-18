import React from 'react';
import { bool, func, number, string, node } from 'prop-types';
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
`;

Img.defaultProps = {
  loaded: false,
};

const Picture = ({
  shouldShowImage,
  width,
  ratio,
  src,
  placeholderColor,
  alt,
  children,
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
      {shouldShowImage ? <Img src={src} alt={alt || src} /> : null}
      {children}
    </div>
  </Wrapper>
);

Picture.defaultProps = {
  shouldShowImage: true,
  alt: undefined,
  onClick: () => {},
  children: null,
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
};

export default Picture;
