import React from 'react';
import { bool, number, string } from 'prop-types';

function getBg() {
  const x = Math.floor(Math.random() * 256);
  const y = Math.floor(Math.random() * 256);
  const z = Math.floor(Math.random() * 256);
  return `rgba(${x},${y},${z}, 0.4)`;
}

const Picture = ({ shouldShowImage, width, ratio, src }) => (
  <div
    style={{
      width,
      display: 'inline-block',
      marginBottom: '-4px',
      backgroundColor: getBg(),
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
          alt="balls"
        />
      ) : null}
    </div>
  </div>
);

Picture.defaultProps = {
  shouldShowImage: true,
};

Picture.propTypes = {
  src: string.isRequired,
  shouldShowImage: bool,
  ratio: number.isRequired,
  width: string.isRequired,
};

export default Picture;
