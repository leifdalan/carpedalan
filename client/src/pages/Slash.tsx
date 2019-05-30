import usePosts from 'hooks/usePosts';
import debounce from 'lodash/debounce';
import isString from 'lodash/isString';
import * as React from 'react';
import { default as Autosizer } from 'react-virtualized-auto-sizer';
import * as ReactWindow from 'react-window';
import { default as InfiniteLoader } from 'react-window-infinite-loader';
import { default as styled } from 'styled-components';

const { useEffect, useRef } = React;
const { VariableSizeList: List } = ReactWindow;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

interface RowRender {
  index: number;
  style: any;
}
const Slash: React.FC = () => {
  const { request, posts, loading } = usePosts();
  const listRef = useRef();

  useEffect(() => {
    request({ page: 1 });
  }, []);

  /**
   * Triggered if isItemLoaded returns false
   *
   * @param {number} index
   * @returns Promise<void>
   */
  function loadMoreItems(index: number) {
    return request({ page: Math.floor(index / 100) + 1 });
  }

  const Row = ({ index, style }: RowRender) => (
    <div
      style={{ ...style, background: posts[index].placeholder }}
      data-testid={index}
    >
      {index}
    </div>
  );

  /**
   * Function for determining if item is "loaded", causes loadMoreItems
   * if falsey
   *
   * @param {number} index
   * @returns {boolean}
   */
  function isItemLoaded(index: number): boolean {
    return !posts[index].fake;
  }

  /**
   * Curried function that takes the container width and calculates
   * the item width based on the image height/width ratio
   *
   * @param {number} containerWidth
   * @returns {(index: number) => number}
   */
  function getItemSize(containerWidth: number): (index: number) => number {
    return function(index: number) {
      let height = 1;
      let width = 1;
      if (posts[index].imageHeight) {
        height = Number(posts[index].imageHeight);
      }
      if (posts[index].imageWidth) {
        width = Number(posts[index].imageWidth);
      }

      const ratio = height / width;
      return ratio * containerWidth;
    };
  }

  return (
    <Wrapper data-testid="home">
      <InfiniteLoader
        ref={listRef}
        itemCount={posts.length}
        isItemLoaded={isItemLoaded}
        loadMoreItems={debounce(loadMoreItems, 100)}
      >
        {({ onItemsRendered, ref }: any) => (
          <Autosizer ref={ref}>
            {({ height, width }) => (
              <List
                height={height}
                ref={ref}
                onItemsRendered={onItemsRendered}
                itemCount={posts.length}
                itemSize={getItemSize(width)}
                width={width}
                children={Row}
              />
            )}
          </Autosizer>
        )}
      </InfiniteLoader>
    </Wrapper>
  );
};

export default Slash;
