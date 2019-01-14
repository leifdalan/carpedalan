import React, { Fragment as F } from 'react';
import { CellMeasurer } from 'react-virtualized';

import { API_IMAGES_PATH, SIZE_MAP } from '../../shared/constants';

import Picture from './Picture';

const RenderRow = props => {
  /* eslint-disable react/prop-types */
  const {
    index,
    key,
    style,
    parent,
    parent: {
      props: {
        posts,
        cache,
        shouldShowImages,
        showDescription,
        size,
        postsPerRow,
        onClick,
      },
    },
  } = props;

  const { width, height } = SIZE_MAP[size];

  const adjustedPostIndex = index * postsPerRow;

  return posts[adjustedPostIndex] ? (
    <CellMeasurer key={key} cache={cache} parent={parent} index={index}>
      <div style={{ ...style }}>
        {[...Array(postsPerRow).keys()].map(subIndex => {
          const post = posts[adjustedPostIndex + subIndex];

          // for rows with lest then row-length cells
          if (!post) {
            return null;
          }

          const src = post.fake
            ? ''
            : `${API_IMAGES_PATH}/${width}${height ? `-${height}` : ''}/${
                post.key.split('/')[1]
              }.webp`;

          return posts[adjustedPostIndex + subIndex] ? (
            <F key={adjustedPostIndex + subIndex}>
              <Picture
                width={`${100 / postsPerRow}%`}
                ratio={1}
                src={src}
                shouldShowImage={shouldShowImages}
                placeholderColor={post.placeholderColor}
                onClick={onClick(adjustedPostIndex + subIndex)}
              />
              {showDescription ? posts[index].description : null}
            </F>
          ) : null;
        })}
      </div>
    </CellMeasurer>
  ) : null;
};

export default RenderRow;
