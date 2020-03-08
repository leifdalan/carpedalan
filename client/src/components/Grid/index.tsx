import debug from 'debug';
import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Autosizer from 'react-virtualized-auto-sizer';
import * as ReactWindow from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import styled from 'styled-components';

import Picture from 'components/Picture';
import { defaultPostsPerPage } from 'config';
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

const Grid = ({
  itemsWithTitle,
}: {
  itemsWithTitle: PostsWithTagsWithFakes[];
}): React.ReactElement => {
  const { request } = usePosts();
  const [refWidth, setRefWidth] = useState<number>(0);
  const { width } = useWindow();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const postsPerRow = Math.floor(refWidth / 150);

  useEffect(() => {
    if (wrapperRef.current !== null) {
      const { width } = wrapperRef.current.getBoundingClientRect();
      setRefWidth(width);
    }
  }, [width]);

  /**
   * Triggered if isItemLoaded returns false
   *
   * @param {number} index
   * @returns Promise<void>
   */
  const loadMoreItems = useCallback(
    (index: number): Promise<void> => {
      const realIndex = index * postsPerRow;
      return request({
        requestBody: { page: Math.floor(realIndex / defaultPostsPerPage) + 1 },
      });
    },
    [postsPerRow, request],
  );

  const Row = useCallback(
    ({ index, style }: ReactWindow.ListChildComponentProps) => {
      const postsPerRow = Math.floor(refWidth / 150);

      if (index === 0 && itemsWithTitle[0]) {
        return <div style={style}>{itemsWithTitle[0].key}</div>;
      }

      return (
        <RowWrapper
          key={itemsWithTitle[index].id}
          style={style}
          data-testid={index}
        >
          {[...Array(postsPerRow).fill(0)].map((num, arrayIndex) => {
            const post = itemsWithTitle[index * postsPerRow + arrayIndex];
            const galleryLink = `gallery/${
              post.id ? post.id.split('-')[0] : ''
            }#grid`;

            return (
              <StyledLink to={galleryLink} key={post.id}>
                <Picture
                  width="100%"
                  ratio={1}
                  post={post}
                  shouldShowImage
                  placeholderColor={itemsWithTitle[index].placeholder}
                  alt={itemsWithTitle[index].description}
                  type="square"
                />
              </StyledLink>
            );
          })}
        </RowWrapper>
      );
    },
    [itemsWithTitle, refWidth],
  );

  /**
   * Function for determining if item is "loaded", causes loadMoreItems
   * if falsey
   *
   * @param {number} index
   * @returns {boolean}
   */
  const isItemLoaded = useCallback(
    (index: number): boolean => {
      log('index for grid', index, postsPerRow);
      if (!itemsWithTitle[index * postsPerRow]) {
        log(
          '%c Overflow',
          'background: red; color: black',
          index * postsPerRow,
        );
        return true;
      }
      log(
        'itemsWithTitle[index * postsPerRow]',
        itemsWithTitle[index * postsPerRow],
      );
      return !itemsWithTitle[index * postsPerRow].fake;
    },
    [itemsWithTitle, postsPerRow],
  );

  /**
   * Curried function that takes the container width and calculates
   * the item width based on the image height/width ratio. If there is no height,
   * assume the ratio is 1.
   *
   * @param {number} containerWidth
   * @returns {(index: number) => number}
   */
  const getItemSize = useCallback(
    (containerWidth: number): ((index: number) => number) => {
      return function calculateSize() {
        const postsPerRow = Math.floor(refWidth / 150);
        return containerWidth / postsPerRow;
      };
    },
    [refWidth],
  );

  return useMemo(
    () => (
      <Wrapper ref={wrapperRef}>
        <Autosizer>
          {({ height, width }) => (
            <InfiniteLoader
              itemCount={itemsWithTitle.length}
              isItemLoaded={isItemLoaded}
              loadMoreItems={loadMoreItems}
            >
              {({ onItemsRendered, ref }) => (
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
    ),
    [
      Row,
      getItemSize,
      isItemLoaded,
      itemsWithTitle.length,
      loadMoreItems,
      postsPerRow,
    ],
  );
};

export default Grid;
