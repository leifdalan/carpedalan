import debug from 'debug';
import React, { memo, useCallback } from 'react';
import Autosizer from 'react-virtualized-auto-sizer';
import * as ReactWindow from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import styled from 'styled-components';

import withErrorBoundary from 'components/ErrorBoundary';
import Post from 'components/Post';
import { defaultPostsPerPage } from 'config';
import { PostsWithTagsWithFakes } from 'hooks/types';
import usePosts from 'hooks/usePosts';
import useScrollPersist from 'hooks/useScrollPersist';

const log = debug('component:Feed');

const InnerWrapper = styled.main`
  max-width: 768px;
  margin: auto;
  height: 100%;
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
  font-family: 'lobster';
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
  const { infiniteRef, handleScroll } = useScrollPersist('feed');
  /**
   * Triggered if isItemLoaded returns false
   *
   * @param {number} index
   * @returns Promise<void>
   */
  const loadMoreItems = useCallback(
    async (startIndex: number) => {
      log(
        '%c loading from feed',
        'background: red; font-size: 32px',
        startIndex,
        Math.floor(startIndex / defaultPostsPerPage) + 1,
      );
      const page = Math.floor(startIndex / defaultPostsPerPage) + 1;

      if (infiniteRef) {
        log('RESETTTING!!!!!', startIndex);
      }
      await request({
        requestBody: {
          page: Math.floor(startIndex / defaultPostsPerPage) + 1,
        },
      });
      infiniteRef.current._listRef.resetAfterIndex(0, true);
      return Promise.resolve();
    },
    [infiniteRef, request],
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
      return !itemsWithTitle[index].fake;
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
            <InnerWrapper>
              <div
                onClick={() =>
                  infiniteRef.current._listRef.resetAfterIndex(0, true)}
              >
                RESET
              </div>
              <List
                ref={ref}
                height={height}
                itemData={itemsWithTitle}
                onItemsRendered={onItemsRendered}
                itemCount={itemsWithTitle.length}
                itemSize={calculateSize(width)}
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
  );
};

export default withErrorBoundary({ Component: Feed, namespace: 'Feed' });
