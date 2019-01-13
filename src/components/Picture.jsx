import React from 'react';
import { bool, func, number, string } from 'prop-types';
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
  onClick,
}) => (
  <Wrapper
    style={{
      width,
      backgroundColor: placeholderColor,
    }}
    onClick={onClick}
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
  onClick: () => {},
};

Picture.propTypes = {
  src: string.isRequired,
  shouldShowImage: bool,
  ratio: number.isRequired,
  width: string.isRequired,
  placeholderColor: string.isRequired,
  alt: string,
  onClick: func,
};

export default Picture;
