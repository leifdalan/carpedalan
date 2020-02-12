import debug from 'debug';
import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Autosizer from 'react-virtualized-auto-sizer';
import * as ReactWindow from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import styled from 'styled-components';

import Picture from 'components/Picture';
import { PostsWithTagsWithFakes } from 'hooks/types';
import usePosts from 'hooks/usePosts';
import useWindow from 'hooks/useWindow';

const log = debug('component:Grid');

const { useState } = React;
const InnerWrapper = styled.main`
  max-width: 768px;
  margin: auto;
  height: 100%;
`;

const { useRef, useEffect } = React;
const { VariableSizeList: List } = ReactWindow;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const RowWrapper = styled.div`
  display: flex;
`;

const StyledLink = styled(Link)`
  display: block;
  width: 100%;
`;

interface RowRender {
  index: number;
  style: React.CSSProperties;
}

const Grid = ({
  itemsWithTitle,
}: {
  itemsWithTitle: PostsWithTagsWithFakes[];
}): React.ReactElement => {
  const { request } = usePosts();
  const [refWidth, setRefWidth] = useState<number>(0);
  const { width } = useWindow();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const galleryLinkPrefix = location.pathname.endsWith('/')
    ? location.pathname
    : `${location.pathname}/`;

  const postsPerRow = Math.floor(refWidth / 150);

  useEffect(() => {
    if (wrapperRef.current !== null) {
      const { width } = wrapperRef.current.getBoundingClientRect();
      setRefWidth(width);
    }
  }, [wrapperRef.current, width]);

  /**
   * Triggered if isItemLoaded returns false
   *
   * @param {number} index
   * @returns Promise<void>
   */
  function loadMoreItems(index: number): Promise<void> {
    const realIndex = index * postsPerRow;
    return request({ page: Math.floor(realIndex / 100) + 1 });
  }

  const Row = ({ index, style }: RowRender) => {
    const postsPerRow = Math.floor(refWidth / 150);

    if (index === 0 && itemsWithTitle[0]) {
      return <div style={style}>{itemsWithTitle[0].key}</div>;
    }

    return (
      <RowWrapper style={style} data-testid={index}>
        {[...Array(postsPerRow).fill(0)].map((num, arrayIndex) => {
          const post = itemsWithTitle[index * postsPerRow + arrayIndex];
          const galleryLink = `${galleryLinkPrefix}gallery/${
            post.id ? post.id.split('-')[0] : ''
          }#grid`;

          const isGallery = location.pathname.includes('gallery');

          let Element = React.Fragment;
          let props = {};

          if (!isGallery) {
            Element = StyledLink;
            props = {
              to: galleryLink,
            };
          }

          return (
            <Element {...props} key={post.id}>
              <Picture
                width="100%"
                ratio={1}
                post={post}
                shouldShowImage
                placeholderColor={itemsWithTitle[index].placeholder}
                alt={itemsWithTitle[index].description}
                type="square"
              />
            </Element>
          );
        })}
      </RowWrapper>
    );
  };

  /**
   * Function for determining if item is "loaded", causes loadMoreItems
   * if falsey
   *
   * @param {number} index
   * @returns {boolean}
   */
  function isItemLoaded(index: number): boolean {
    if (!itemsWithTitle[index * postsPerRow]) {
      log('%c Overflow', 'background: red; color: black', index * postsPerRow);
      return true;
    }
    return !itemsWithTitle[index * postsPerRow].fake;
  }

  /**
   * Curried function that takes the container width and calculates
   * the item width based on the image height/width ratio. If there is no height,
   * assume the ratio is 1.
   *
   * @param {number} containerWidth
   * @returns {(index: number) => number}
   */
  function getItemSize(containerWidth: number): (index: number) => number {
    return function calculateSize() {
      const postsPerRow = Math.floor(refWidth / 150);
      return containerWidth / postsPerRow;
    };
  }

  return (
    <Wrapper ref={wrapperRef}>
      <Autosizer>
        {({ height, width }) => (
          <InfiniteLoader
            itemCount={itemsWithTitle.length}
            isItemLoaded={isItemLoaded}
            loadMoreItems={loadMoreItems}
          >
            {({
              onItemsRendered,
              ref,
            }: {
              onItemsRendered: () => void;
              ref: React.MutableRefObject<null>;
            }) => (
              <InnerWrapper>
                <List
                  ref={ref}
                  height={height}
                  onItemsRendered={onItemsRendered}
                  itemCount={
                    Math.floor(itemsWithTitle.length / postsPerRow) || 1
                  }
                  itemSize={getItemSize(width)}
                  width={width}
                >
                  {Row}
                </List>
              </InnerWrapper>
            )}
          </InfiniteLoader>
        )}
      </Autosizer>
    </Wrapper>
  );
};

export default Grid;
