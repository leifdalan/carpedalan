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
import useScrollPersist from 'hooks/useScrollPersist';
import useWindow from 'hooks/useWindow';
import { propTrueFalse } from 'styles/utils';

const log = debug('component:Grid');

const { useState } = React;

interface InnerWrapperI {
  hasPersisted: boolean;
}
const InnerWrapper = styled.main<InnerWrapperI>`
  max-width: 768px;
  margin: auto;
  height: 100%;
  opacity: ${propTrueFalse('hasPersisted', 1, 0)};
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
  const {
    infiniteRef,
    handleItemRendered,
    hasPersisted,
    scrollIndex,
  } = useScrollPersist('grid', itemsWithTitle);

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
    (startIndex: number, stopIndex: number): Promise<void[]> => {
      const average = Math.floor((stopIndex + startIndex) / 2);

      const realIndex = average * postsPerRow;
      const averagePage = Math.floor(realIndex / defaultPostsPerPage) + 1;
      const aboveAveragePage =
        Math.floor((stopIndex * postsPerRow) / defaultPostsPerPage) + 1;
      const belowAveragePage =
        Math.floor((startIndex * postsPerRow) / defaultPostsPerPage) + 1;
      const pagesToLoad = [averagePage];
      if (averagePage !== aboveAveragePage) pagesToLoad.push(aboveAveragePage);
      if (averagePage !== belowAveragePage) pagesToLoad.push(belowAveragePage);
      log(
        'Grid Load more',
        pagesToLoad,
        startIndex,
        stopIndex,
        average,
        postsPerRow,
        realIndex,
      );

      if ((itemsWithTitle.length > 1 && hasPersisted) || scrollIndex === 0) {
        return Promise.all(
          pagesToLoad.map(page =>
            request({
              requestBody: {
                page,
              },
            }),
          ),
        );
      }
      return Promise.resolve([]);
    },
    [hasPersisted, itemsWithTitle.length, postsPerRow, request, scrollIndex],
  );

  const Row = useCallback(
    ({ index, style, isScrolling }: ReactWindow.ListChildComponentProps) => {
      const postsPerRow = Math.floor(refWidth / 150);

      if (index === 0 && itemsWithTitle[0]) {
        return <div style={style}>{itemsWithTitle[0].key}</div>;
      }

      return (
        <RowWrapper key={index} style={style} data-testid={index}>
          {[...Array(postsPerRow).fill(0)].map((num, arrayIndex) => {
            const post = itemsWithTitle[index * postsPerRow + arrayIndex];
            if (!post) return null;
            const galleryLink = `gallery/${
              post.id ? post.id.split('-')[0] : ''
            }#grid`;

            return (
              <StyledLink
                to={galleryLink}
                key={index * postsPerRow + arrayIndex}
              >
                <Picture
                  width="100%"
                  ratio={1}
                  post={post}
                  shouldShowImage={!isScrolling}
                  placeholderColor={post.placeholder}
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
              ref={infiniteRef}
            >
              {({ onItemsRendered, ref }) => (
                <InnerWrapper hasPersisted={hasPersisted}>
                  <List
                    ref={ref}
                    height={height}
                    useIsScrolling
                    onItemsRendered={args => {
                      handleItemRendered(args);
                      onItemsRendered(args);
                    }}
                    itemCount={
                      Math.floor(itemsWithTitle.length / postsPerRow) || 1
                    }
                    itemSize={getItemSize(width)}
                    width={width}
                    estimatedItemSize={width / postsPerRow}
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
      handleItemRendered,
      hasPersisted,
      infiniteRef,
      isItemLoaded,
      itemsWithTitle.length,
      loadMoreItems,
      postsPerRow,
    ],
  );
};

export default Grid;
