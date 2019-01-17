import React from 'react';
import { Link } from 'react-router-dom';
import { CellMeasurer } from 'react-virtualized';

import { SIZE_MAP } from '../../shared/constants';
import { getImagePath } from '../utils';

import Picture from './Picture';

const RenderRow = props => {
  /* eslint-disable react/prop-types */
  const {
    index,
    key,
    style,
    parent,
    parent: {
      props: { posts, cache, shouldShowImages, size, postsPerRow, match },
    },
  } = props;

  const adjustedPostIndex = index * postsPerRow;

  return posts[adjustedPostIndex] ? (
    <CellMeasurer key={key} cache={cache} parent={parent} index={index}>
      <div style={{ ...style }}>
        {[...Array(postsPerRow).keys()].map(subIndex => {
          const postIndex = adjustedPostIndex + subIndex;
          const post = posts[postIndex];

          // for rows with lest then row-length cells
          if (!post) {
            return null;
          }

          const src = getImagePath({ post, size: SIZE_MAP[size] });

          return (
            <Link
              key={postIndex}
              to={`${match.url}/gallery/${post.id.split('-')[0]}`}
            >
              <Picture
                width={`${100 / postsPerRow}%`}
                ratio={1}
                src={src}
                shouldShowImage={shouldShowImages}
                placeholderColor={post.placeholderColor}
                // onClick={onClick(postIndex)}
              />
            </Link>
          );
        })}
      </div>
    </CellMeasurer>
  ) : null;
};

export default RenderRow;
