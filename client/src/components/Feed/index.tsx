import debug from 'debug';
import * as React from 'react';
import Autosizer from 'react-virtualized-auto-sizer';
import * as ReactWindow from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import styled from 'styled-components';

import Post from 'components/Post';
import { PostsWithTagsWithFakes } from 'hooks/types';
import usePosts from 'hooks/usePosts';

const log = debug('component:Feed');

const InnerWrapper = styled.main`
  max-width: 768px;
  margin: auto;
  height: 100%;
`;

const { VariableSizeList: List } = ReactWindow;

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
}

const Feed = ({
  itemsWithTitle,
}: {
  itemsWithTitle: PostsWithTagsWithFakes[];
}): React.ReactElement => {
  const { request } = usePosts();

  /**
   * Triggered if isItemLoaded returns false
   *
   * @param {number} index
   * @returns Promise<void>
   */
  function loadMoreItems(index: number) {
    log('loading from feedd');
    return request({
      requestBody: {
        page: Math.floor(index / 100) + 1,
      },
    });
  }

  const Row = ({ index, style }: RowRender) => {
    if (index === 0 && itemsWithTitle[0]) {
      return <div style={style}>{itemsWithTitle[0].key}</div>;
    }
    return (
      <RowWrapper style={style} data-testid={index}>
        <PostWrapper>
          <Post post={itemsWithTitle[index]} />
        </PostWrapper>
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
    return !itemsWithTitle[index].fake;
  }

  function calculateSize(index: number): number {
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
    let size = ratio * Math.min(768, 620);
    if (post.description) size += 34;
    if (post.tags && post.tags.length) size += 34;
    return size + 58;
  }

  return (
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
                itemCount={itemsWithTitle.length}
                itemSize={calculateSize}
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

export default Feed;
