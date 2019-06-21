import Picture from 'components/Picture';
import debug from 'debug';
import usePosts, { PostsWithTagsWithFakes } from 'hooks/usePosts';
import useWindow from 'hooks/useWindow';
import * as React from 'react';
import { default as Autosizer } from 'react-virtualized-auto-sizer';
import * as ReactWindow from 'react-window';
import { default as InfiniteLoader } from 'react-window-infinite-loader';
import { default as styled } from 'styled-components';
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

interface RowRender {
  index: number;
  style: React.CSSProperties;
}

const Grid = ({
  itemsWithTitle,
}: {
  itemsWithTitle: PostsWithTagsWithFakes[];
}): React.ReactElement => {
  const { request, loading, posts } = usePosts();
  const [refWidth, setRefWidth] = useState<number>(0);
  const { width } = useWindow();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const postsPerRow = Math.floor(refWidth / 150);

  useEffect(
    () => {
      if (wrapperRef.current !== null) {
        const { width } = wrapperRef.current.getBoundingClientRect();
        setRefWidth(width);
      }
    },
    [wrapperRef.current, width],
  );

  /**
   * Triggered if isItemLoaded returns false
   *
   * @param {number} index
   * @returns Promise<void>
   */
  function loadMoreItems(index: number) {
    const realIndex = index * postsPerRow;
    log('%c Load more items', 'color: red;', { realIndex, index, postsPerRow });
    return request({ page: Math.floor(realIndex / 100) + 1 });
  }

  const Row = ({ index, style }: RowRender) => {
    const postsPerRow = Math.floor(refWidth / 150);

    if (index === 0) {
      return <div style={style}>Title</div>;
    }

    return (
      <RowWrapper style={style} data-testid={index}>
        {[...Array(postsPerRow).fill(0)].map((num, arrayIndex) => (
          <Picture
            key={arrayIndex}
            width={`${refWidth / postsPerRow * 100}%`}
            ratio={1}
            post={itemsWithTitle[index * postsPerRow + arrayIndex]}
            shouldShowImage={true}
            placeholderColor={itemsWithTitle[index].placeholder}
            alt={itemsWithTitle[index].description}
            type="square"
          />
        ))}
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
    return function calculateSize(index: number) {
      const postsPerRow = Math.floor(refWidth / 150);
      return containerWidth / postsPerRow;
    };
  }

  return (
    <Wrapper ref={wrapperRef}>
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
                  itemCount={Math.floor(itemsWithTitle.length / postsPerRow)}
                  itemSize={getItemSize(width)}
                  width={width}
                  children={Row}
                />
              </InnerWrapper>
            )}
          </Autosizer>
        )}
      </InfiniteLoader>
    </Wrapper>
  );
};

export default Grid;
