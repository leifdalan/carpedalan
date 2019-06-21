import Picture from 'components/Picture';
import Post from 'components/Post';
import debug from 'debug';
import usePosts, { PostsWithTagsWithFakes } from 'hooks/usePosts';
import useRouter from 'hooks/useRouter';
import useWindow from 'hooks/useWindow';
import * as React from 'react';
import { default as Autosizer } from 'react-virtualized-auto-sizer';
import * as ReactWindow from 'react-window';
import { default as InfiniteLoader } from 'react-window-infinite-loader';
import { default as styled } from 'styled-components';

const log = debug('component:Feed');

const { useState, useLayoutEffect } = React;

const InnerWrapper = styled.main`
  max-width: 768px;
  margin: auto;
  height: 100%;
`;

const { useEffect, useRef } = React;
const { VariableSizeList: List } = ReactWindow;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const PostWrapper = styled.article`
  max-width: 620px;
  width: 100%;
  margin: 0 auto;
`;

const GridListSwitcher = styled.div`
  position: fixed;
  z-index: 2;
  top: 0;
  right: 0;
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
  const { request, posts, loading } = usePosts();
  const [refWidth, setRefWidth] = useState<number>(0);
  const wrapperRef = useRef<HTMLInputElement>(null);
  const { width } = useWindow();
  const {
    location: { hash, pathname },
  } = useRouter();

  /**
   * Triggered if isItemLoaded returns false
   *
   * @param {number} index
   * @returns Promise<void>
   */
  function loadMoreItems(index: number) {
    return request({ page: Math.floor(index / 100) + 1 });
  }

  const Row = ({ index, style }: RowRender) => {
    if (index === 0) {
      return <div style={style}>Title</div>;
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

  /**
   * Curried function that takes the container width and calculates
   * the item width based on the image height/width ratio. If there is no height,
   * assume the ratio is 1.
   *
   * @param {number} containerWidth
   * @returns {(index: number) => number}
   */
  function getItemSize(containerWidth: number): (index: number) => number {
    return function calculateSize(index: number) {
      const post = itemsWithTitle[index];
      let height = 1;
      let width = 1;
      if (post.imageHeight) {
        height = Number(post.imageHeight);
      }
      if (post.imageWidth) {
        width = Number(post.imageWidth);
      }

      const ratio = height / width;
      let size = ratio * Math.min(containerWidth, 620);
      if (post.description) size += 34;
      if (post.tags && post.tags.length) size += 34;
      return size + 58;
    };
  }

  return (
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
        <Autosizer ref={ref}>
          {({ height, width }) => (
            <InnerWrapper>
              <List
                height={height}
                onItemsRendered={onItemsRendered}
                itemCount={itemsWithTitle.length}
                itemSize={getItemSize(width)}
                width={width}
                children={Row}
              />
            </InnerWrapper>
          )}
        </Autosizer>
      )}
    </InfiniteLoader>
  );
};

export default Feed;
