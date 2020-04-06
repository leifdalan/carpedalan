import debug from 'debug';
import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import Autosizer from 'react-virtualized-auto-sizer';
import * as ReactWindow from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import styled from 'styled-components';

import Picture from 'components/Picture';
import ScrollerHandle from 'components/ScrollerHandle';
import { defaultPostsPerPage } from 'config';
import { PostsWithTagsWithFakes } from 'hooks/types';
import usePosts from 'hooks/usePosts';
import usePrevious from 'hooks/usePrevious';
import useScrollPersist from 'hooks/useScrollPersist';
import useWindow from 'hooks/useWindow';
import { propTrueFalse } from 'styles/utils';

const log = debug('component:Grid');
const THUMB_SIZE = 200;
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

const { FixedSizeList: List } = ReactWindow;

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

const Title = styled.h1`
  font-family: lobster, sans-serif;
  margin-top: 70px;
  text-align: center;
  font-size: 48px;
  letter-spacing: 3px;
  span {
    background: rgb(35, 0, 36);
    background: radial-gradient(
      rgba(122, 0, 102, 1) 0%,
      rgba(42, 0, 76, 1) 65%,
      rgba(35, 0, 36, 1) 100%
    );

    /* clip hackery */
    background-clip: text;
    /* stylelint-disable */
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Empty = styled.div`
  width: 100%;
`;

const Grid = ({
  itemsWithTitle,
}: {
  itemsWithTitle: PostsWithTagsWithFakes[];
}): React.ReactElement => {
  const { tagName } = useParams();
  const isTag = useMemo(() => !!tagName, [tagName]);
  const { request } = usePosts();
  const [refWidth, setRefWidth] = useState<number>(0);
  const { width } = useWindow();
  const {
    infiniteRef,
    handleItemRendered,
    hasPersisted,
    scrollIndex,
    handleScroll,
    scrollPos,
    velocity,
    hasMoved,
  } = useScrollPersist(`grid-${tagName}`, itemsWithTitle);
  const { width: windowWidth, height: windowHeight } = useWindow();
  const indices = useRef<[number, number] | null>(null);

  const [isUsingScrollHandle, setIsUsingScrollHandle] = useState(false);
  const previousScrollHandle = usePrevious(isUsingScrollHandle);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const postsPerRow = useMemo(() => {
    // let's have at least 2 for you cheapskates
    return Math.max(Math.floor(refWidth / THUMB_SIZE), 2);
  }, [refWidth]);
  log('postsPerRow', postsPerRow);
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
      if (isUsingScrollHandle) {
        indices.current = [startIndex, stopIndex];

        return Promise.resolve([]);
      }

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
      indices.current = [startIndex, stopIndex];
      return Promise.resolve([]);
    },
    [
      hasPersisted,
      isUsingScrollHandle,
      itemsWithTitle.length,
      postsPerRow,
      request,
      scrollIndex,
    ],
  );

  useEffect(() => {
    if (
      previousScrollHandle &&
      !isUsingScrollHandle &&
      indices?.current?.[0] &&
      indices?.current?.[1]
    ) {
      log('Calling load more');
      loadMoreItems(indices.current[0], indices.current[1]);
    }
  }, [isUsingScrollHandle, loadMoreItems, previousScrollHandle]);

  const Row = useCallback(
    ({ index, style, isScrolling }: ReactWindow.ListChildComponentProps) => {
      if (index === 0 && itemsWithTitle[0]) {
        return (
          <Title style={{ ...style, height: '150px' }}>
            <span>{`${isTag ? '#' : ''}${itemsWithTitle[0].key}`}</span>
          </Title>
        );
      }

      return (
        <RowWrapper key={index} style={style} data-testid={index}>
          {[...Array(postsPerRow).fill(0)].map((num, arrayIndex) => {
            const post =
              itemsWithTitle[
                index * postsPerRow + arrayIndex - postsPerRow + 1
              ];
            if (!post) return <Empty />;
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
    [isTag, itemsWithTitle, postsPerRow],
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

  const getItemSize = useCallback(() => {
    return windowWidth / postsPerRow;
  }, [postsPerRow, windowWidth]);

  const itemCount = useMemo(() => {
    /**
     * The first row is the title, and the rest are skipped for that row.
     * So we need to account for basically a row that counts as a row but only
     * has one item in it.
     */
    return (
      Math.ceil((itemsWithTitle.length + (postsPerRow - 1)) / postsPerRow) || 1
    );
  }, [itemsWithTitle.length, postsPerRow]);

  const totalHeight = useMemo(() => {
    return getItemSize() * itemCount;
  }, [getItemSize, itemCount]);

  return useMemo(
    () => (
      <>
        {!isTag ? (
          <ScrollerHandle
            infiniteRef={infiniteRef}
            scrollPos={scrollPos}
            windowHeight={windowHeight}
            containerHeight={totalHeight}
            setIsUsingScrollHandle={setIsUsingScrollHandle}
            isUsingScrollHandle={isUsingScrollHandle}
            scrollVelocity={velocity}
            hasMoved={hasMoved}
            disableClickAction
          />
        ) : null}

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
                      itemCount={itemCount}
                      itemSize={getItemSize()}
                      width={width}
                      onScroll={handleScroll}
                    >
                      {Row}
                    </List>
                  </InnerWrapper>
                )}
              </InfiniteLoader>
            )}
          </Autosizer>
        </Wrapper>
      </>
    ),
    [
      Row,
      getItemSize,
      handleItemRendered,
      handleScroll,
      hasMoved,
      hasPersisted,
      infiniteRef,
      isItemLoaded,
      isTag,
      isUsingScrollHandle,
      itemCount,
      itemsWithTitle.length,
      loadMoreItems,
      scrollPos,
      totalHeight,
      velocity,
      windowHeight,
    ],
  );
};

export default Grid;
