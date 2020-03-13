import debug from 'debug';
import React, { memo, useCallback, useEffect } from 'react';
import Autosizer from 'react-virtualized-auto-sizer';
import * as ReactWindow from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import styled from 'styled-components';

import withErrorBoundary from 'components/ErrorBoundary';
import Post from 'components/Post';
import { defaultPostsPerPage } from 'config';
import { PostsWithTagsWithFakes } from 'hooks/types';
import usePosts from 'hooks/usePosts';
import usePrevious from 'hooks/usePrevious';
import useScrollPersist from 'hooks/useScrollPersist';
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
}

const Title = styled.h1`
  font-family: lobster, sans-serif;
  margin-top: 70px;
  text-align: center;
  font-size: 48px;
  letter-spacing: 3px;
`;

const Row = memo(({ index, style, data }: RowRender) => {
  if (index === 0 && data[0]) {
    return <Title style={{ ...style, height: '150px' }}>{data[0].key}</Title>;
  }
  return (
    <RowWrapper style={style} data-testid={index}>
      <PostWrapper>
        <Post hasLink post={data[index]} />
      </PostWrapper>
    </RowWrapper>
  );
}, areEqual);

const Feed = ({
  itemsWithTitle,
}: {
  itemsWithTitle: PostsWithTagsWithFakes[];
}): React.ReactElement => {
  const { request } = usePosts();

  const {
    infiniteRef,
    handleScroll,
    hasPersisted,
    scrollIndex,
  } = useScrollPersist('feed', itemsWithTitle);
  const previousItemsWithTitle = usePrevious(itemsWithTitle);
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
      const average = Math.floor((stopIndex + startIndex) / 2);

      if ((itemsWithTitle.length > 1 && hasPersisted) || scrollIndex === 0) {
        await request({
          requestBody: {
            page: Math.floor(average / defaultPostsPerPage) + 1,
          },
        });
      }

      return Promise.resolve();
    },
    [hasPersisted, itemsWithTitle.length, request, scrollIndex],
  );

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
    containerWidth => (index: number): number => {
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
      let size = ratio * Math.min(containerWidth, 620);
      if (post.description) size += 34;
      if (post.tags && post.tags.length) size += 34;
      return size + 112;
    },
    [itemsWithTitle],
  );

  return (
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
                itemData={itemsWithTitle}
                onItemsRendered={args => {
                  handleScroll(args);
                  onItemsRendered(args);
                }}
                itemCount={itemsWithTitle.length}
                itemSize={calculateSize(width)}
                width={width}
              >
                {Row}
              </List>
            </InnerWrapper>
          )}
        </InfiniteLoader>
      )}
    </Autosizer>
  );
};

export default withErrorBoundary({ Component: Feed, namespace: 'Feed' });
