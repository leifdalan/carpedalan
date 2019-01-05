import React, { useEffect, useRef, useState } from 'react';
import { arrayOf, func, number, shape, string } from 'prop-types';
import {
  AutoSizer,
  CellMeasurerCache,
  List,
  InfiniteLoader,
  WindowScroller,
} from 'react-virtualized';

import { THUMB } from '../../shared/constants';

import PostGridRowRenderer from './PostGridRowRenderer';

// Default sizes help Masonry decide how many images to batch-measure
const POST_WIDTH = 100;

const cache = new CellMeasurerCache({
  defaultHeight: POST_WIDTH,
  defaultWidth: POST_WIDTH,
  fixedWidth: true,
});

export default function Grid({ type, fetchData, data, meta }) {
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(
    () => {
      fetchData(1);
    },
    [type],
  );

  const isRowLoaded = width => ({ index }) =>
    !!data[index * Math.floor(width / POST_WIDTH)];

  async function loadMoreRows() {
    if (!loading) {
      setLoading(true);
      await fetchData();
      setLoading(false);
    }
  }

  return (
    <WindowScroller>
      {({ height, isScrolling, registerChild, onChildScroll, scrollTop }) => (
        <AutoSizer disableHeight>
          {({ width }) => {
            const postsPerRow = Math.floor(width / POST_WIDTH);
            return (
              <InfiniteLoader
                isRowLoaded={isRowLoaded(width)}
                loadMoreRows={loadMoreRows}
                rowCount={meta.count / postsPerRow}
              >
                {({ onRowsRendered }) => (
                  <div ref={registerChild}>
                    <List
                      width={width}
                      height={height}
                      autoHeight
                      ref={listRef}
                      onRowsRendered={onRowsRendered}
                      deferredMeasurementCache={cache}
                      onScroll={onChildScroll}
                      rowHeight={cache.rowHeight}
                      rowRenderer={PostGridRowRenderer}
                      rowCount={meta.count / postsPerRow}
                      overscanRowCount={20}
                      isScrolling={isScrolling}
                      scrollTop={scrollTop}
                      posts={data}
                      cache={cache}
                      size={THUMB}
                      showDescription={false}
                      shouldShowImages
                      postsPerRow={postsPerRow}
                    />
                  </div>
                )}
              </InfiniteLoader>
            );
          }}
        </AutoSizer>
      )}
    </WindowScroller>
  );
}

Grid.defaultProps = {
  type: null,
};

Grid.propTypes = {
  fetchData: func.isRequired,
  data: arrayOf(shape({ id: string.isRequired })).isRequired,
  meta: shape({
    count: number.isRequired,
  }).isRequired,
  type: string,
};
