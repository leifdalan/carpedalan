import React from 'react';
import { bool, number, string } from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: inline-block;
  margin-bottom: -4px;
`;

const Picture = ({
  shouldShowImage,
  width,
  ratio,
  src,
  placeholderColor,
  alt,
}) => (
  <Wrapper
    style={{
      width,
      backgroundColor: placeholderColor,
    }}
  >
    <div
      className="image"
      style={{
        paddingTop: `${ratio * 100}%`,
        position: 'relative',
      }}
    >
      {shouldShowImage ? (
        <img
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
          src={src}
          alt={alt || src}
        />
      ) : null}
    </div>
  </Wrapper>
);

Picture.defaultProps = {
  shouldShowImage: true,
  alt: undefined,
};

Picture.propTypes = {
  src: string.isRequired,
  shouldShowImage: bool,
  ratio: number.isRequired,
  width: string.isRequired,
  placeholderColor: string.isRequired,
  alt: string,
};

export default Picture;
