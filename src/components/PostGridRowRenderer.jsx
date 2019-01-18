import React, { Fragment, useEffect, useState } from 'react';
import { CellMeasurer } from 'react-virtualized';
import styled from 'styled-components';

import { SIZE_MAP } from '../../shared/constants';
import usePrevious from '../hooks/usePrevious';
import { getImagePath } from '../utils';
import { performance } from '../utils/globals';

import Picture from './Picture';

const SuccessContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 255, 0.4);
`;

const RenderRow = props => {
  /* eslint-disable react/prop-types */
  const {
    index,
    style,
    parent,
    history,
    parent: {
      props: {
        posts,
        cache,
        shouldShowImages,
        size,
        postsPerRow,
        match,
        location,
        isSelecting,
        setSelecting,
        addSelect,
        selected,
      },
    },
  } = props;

  const [mouseDown, setMouseDown] = useState(false);
  const [selectIndex, setSelectIndex] = useState(null);
  const previousMouseDown = usePrevious(mouseDown);
  const adjustedPostIndex = index * postsPerRow;

  const handleMouseDown = clickedIndex => e => {
    e.preventDefault();
    setMouseDown(performance.now());
    e.stopPropagation();
    setSelectIndex(clickedIndex);
  };

  useEffect(
    () => {
      if (mouseDown && previousMouseDown) {
        if (mouseDown - previousMouseDown > 250) {
          setSelecting(true);
          addSelect(selectIndex);
        } else {
          history.push(
            `${match.url === '/' ? '' : match.url}/gallery/${
              posts[selectIndex].id.split('-')[0]
            }${location.hash}`,
          );
        }
      }
      return null;
    },
    [mouseDown],
  );

  return posts[adjustedPostIndex] ? (
    <CellMeasurer
      key={posts[adjustedPostIndex]}
      cache={cache}
      parent={parent}
      index={index}
    >
      <div style={{ ...style }}>
        {[...Array(postsPerRow).keys()].map(subIndex => {
          const postIndex = adjustedPostIndex + subIndex;
          const post = posts[postIndex];

          // for rows with lest then row-length cells
          if (!post) {
            return null;
          }
          let picProps = {};

          if (isSelecting) {
            picProps = {
              onClick: addSelect(postIndex),
            };
          } else {
            picProps = {
              onMouseDown: handleMouseDown(postIndex),
              onMouseUp: () => setMouseDown(performance.now()),
            };
          }

          const src = getImagePath({ post, size: SIZE_MAP[size] });

          return (
            <Fragment key={postIndex}>
              <Picture
                width={`${100 / postsPerRow}%`}
                ratio={1}
                src={src}
                shouldShowImage={shouldShowImages}
                placeholderColor={post.placeholderColor}
                {...picProps}
              >
                {selected[postIndex] ? <SuccessContainer /> : null}
              </Picture>
            </Fragment>
          );
        })}
      </div>
    </CellMeasurer>
  ) : null;
};

export default RenderRow;
