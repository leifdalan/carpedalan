import debug from 'debug';
import React, {
  memo,
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import Autosizer from 'react-virtualized-auto-sizer';
import * as ReactWindow from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import styled from 'styled-components';

import withErrorBoundary from 'components/ErrorBoundary';
import Post from 'components/Post';
import ScrollerHandle from 'components/ScrollerHandle';
import { defaultPostsPerPage } from 'config';
import { PostsWithTagsWithFakes } from 'hooks/types';
import usePosts from 'hooks/usePosts';
import usePrevious from 'hooks/usePrevious';
import useScrollPersist from 'hooks/useScrollPersist';
import useWindow from 'hooks/useWindow';
import { propTrueFalse } from 'styles/utils';

const log = debug('component:Feed');

interface InnerWrapperI {
  hasPersisted: boolean;
}
const InnerWrapper = styled.main<InnerWrapperI>`
  max-width: 768px;
  margin: auto;
  height: 100%;
  opacity: ${propTrueFalse('hasPersisted', 1, 0)};
`;

const { VariableSizeList: List, areEqual } = ReactWindow;

const PostWrapper = styled.article`
  max-width: 620px;
  width: 100%;
  margin: 0 auto;
`;

const RowWrapper = styled.div`
  display: flex;
`;

interface RowRender {
  index: number;
  style: React.CSSProperties;
  data: PostsWithTagsWithFakes[];
  isScrolling: boolean;
}

const Title = styled.h1`
  font-family: lobster, sans-serif;
  margin-top: 70px;
  text-align: center;
  font-size: 48px;
  letter-spacing: 3px;
`;

const Row = memo(
  ({
    index,
    style,
    data,
    isScrolling,
  }: ReactWindow.ListChildComponentProps) => {
    if (index === 0 && data[0]) {
      return <Title style={{ ...style, height: '150px' }}>{data[0].key}</Title>;
    }
    return (
      <RowWrapper style={style} data-testid={index}>
        <PostWrapper>
          <Post hasLink post={data[index]} isScrolling={isScrolling} />
        </PostWrapper>
      </RowWrapper>
    );
  },
  areEqual,
);

const Feed = ({
  itemsWithTitle,
}: {
  itemsWithTitle: PostsWithTagsWithFakes[];
}): React.ReactElement => {
  const { request } = usePosts();

  const {
    infiniteRef,
    handleItemRendered,
    hasPersisted,
    scrollIndex,
    handleScroll,
    scrollPos,
    velocity,
    hasMoved,
  } = useScrollPersist('feed', itemsWithTitle);
  const [isUsingScrollHandle, setIsUsingScrollHandle] = useState(false);
  const previousScrollHandle = usePrevious(isUsingScrollHandle);
  const indices = useRef<[number, number] | null>(null);
  const previousItemsWithTitle = usePrevious(itemsWithTitle);
  const { width: windowWidth, height: windowHeight } = useWindow();
  /**
   * Triggered if isItemLoaded returns false
   *
   * @param {number} index
   * @returns Promise<void>
   */

  const loadMoreItems = useCallback(
    async (startIndex: number, stopIndex: number) => {
      log(
        '%c loading from feed',
        'background: red; font-size: 32px',
        startIndex,
        Math.floor(startIndex / defaultPostsPerPage) + 1,
      );
      if (isUsingScrollHandle) {
        indices.current = [startIndex, stopIndex];
        return Promise.resolve();
      }
      const average = Math.floor((stopIndex + startIndex) / 2);

      if ((itemsWithTitle.length > 1 && hasPersisted) || scrollIndex === 0) {
        await request({
          requestBody: {
            page: Math.floor(average / defaultPostsPerPage) + 1,
          },
        });
      }
      indices.current = [startIndex, stopIndex];
      return Promise.resolve();
    },
    [
      hasPersisted,
      isUsingScrollHandle,
      itemsWithTitle.length,
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

  useEffect(() => {
    if (itemsWithTitle !== previousItemsWithTitle) {
      infiniteRef?.current?._listRef?.resetAfterIndex?.(0, true);
      infiniteRef?.current?._listRef?.scrollToItem?.(scrollIndex, 'center');
    }
  }, [infiniteRef, itemsWithTitle, previousItemsWithTitle, scrollIndex]);

  /**
   * Function for determining if item is "loaded", causes loadMoreItems
   * if falsey
   *
   * @param {number} index
   * @returns {boolean}
   */
  const isItemLoaded = useCallback(
    (index: number): boolean => {
      return !itemsWithTitle[index + 1]?.fake;
    },
    [itemsWithTitle],
  );

  const calculateSize = useCallback(
    (index: number): number => {
      if (index === 0) return 150;
      const post = itemsWithTitle[index];
      let height = 1;
      let width = 1;
      if (post.imageHeight) {
        height = Number(post.imageHeight);
      }
      if (post.imageWidth) {
        width = Number(post.imageWidth);
      }

      const ratio = post.orientation === '6' ? width / height : height / width;
      let size = ratio * Math.min(windowWidth, 620);
      if (post.description) size += 34;
      if (post.tags && post.tags.length) size += 34;
      return size + 112;
    },
    [itemsWithTitle, windowWidth],
  );

  const totalHeight = useMemo(() => {
    return [...Array(itemsWithTitle.length).keys()]
      .map(calculateSize)
      .reduce((acc, number) => acc + number, 0);
  }, [calculateSize, itemsWithTitle.length]);

  return (
    <>
      <ScrollerHandle
        infiniteRef={infiniteRef}
        scrollPos={scrollPos}
        windowHeight={windowHeight}
        containerHeight={totalHeight}
        setIsUsingScrollHandle={setIsUsingScrollHandle}
        isUsingScrollHandle={isUsingScrollHandle}
        scrollVelocity={velocity}
        hasMoved={hasMoved}
      />

      <Autosizer>
        {({ width, height }) => (
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
                  itemData={itemsWithTitle}
                  onItemsRendered={args => {
                    handleItemRendered(args);
                    onItemsRendered(args);
                  }}
                  itemCount={itemsWithTitle.length}
                  itemSize={calculateSize}
                  width={width}
                  estimatedItemSize={width + 150}
                  onScroll={handleScroll}
                >
                  {Row}
                </List>
              </InnerWrapper>
            )}
          </InfiniteLoader>
        )}
      </Autosizer>
    </>
  );
};

export default withErrorBoundary({ Component: Feed, namespace: 'Feed' });
