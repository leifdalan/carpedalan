import usePosts from 'hooks/usePosts';
import debounce from 'lodash/debounce';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { default as Autosizer } from 'react-virtualized-auto-sizer';
import * as ReactWindow from 'react-window';
import { default as InfiniteLoader } from 'react-window-infinite-loader';
import { default as styled } from 'styled-components';

const { useState, useEffect } = React;
const { VariableSizeList: List } = ReactWindow;
const something = '12px';

interface InputProps {
  readonly width?: number;
}
const InputForm =
  styled.form <
  InputProps >
  `
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  max-width: ${({ width }) => width}px;
  max-height: 25em;
  width: 80vw;
  height: 80vh;
  input {
    text-align: center;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

function getItemSize(index: number) {
  return 50;
}

interface RowRender {
  index: number;
  style: any;
}
const Slash: React.FC = () => {
  const { request, posts, loading } = usePosts();
  useEffect(() => {
    request({ page: 1 });
  }, []);

  function loadMoreItems(index: number) {
    return request({ page: Math.floor(index / 100) + 1 });
  }

  const Row = ({ index, style }: RowRender) => (
    <div style={style} data-testid={index}>
      {posts[index].key}
    </div>
  );

  function isItemLoaded(index: number): boolean {
    return !posts[index].fake;
  }

  return (
    <Wrapper data-testid="home">
      <InfiniteLoader
        itemCount={posts.length}
        isItemLoaded={isItemLoaded}
        loadMoreItems={debounce(loadMoreItems, 100)}
      >
        {({ onItemsRendered, ref }: any) => (
          <Autosizer>
            {({ height, width }) => (
              <List
                height={height}
                ref={ref}
                onItemsRendered={onItemsRendered}
                itemCount={posts.length}
                itemSize={getItemSize}
                width={width}
              >
                {Row}
              </List>
            )}
          </Autosizer>
        )}
      </InfiniteLoader>
    </Wrapper>
  );
};

export default Slash;
