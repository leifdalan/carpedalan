import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  AutoSizer,
  InfiniteLoader,
  List,
  WindowScroller,
} from 'react-virtualized';
import throttle from 'lodash/throttle';

import Wrapper from '../styles/Wrapper';
import { MEDIUM } from '../../shared/constants';
import { Posts } from '../providers/PostsProvider';
import { Tag } from '../providers/TagProvider';
import PostRenderer from '../components/PostRenderer';
import Title from '../styles/Title';
import log from '../utils/log';

let lastValue = 0;
const throttled = throttle((e, setShouldShowImages) => {
  const delta = Math.abs(e.scrollTop - lastValue);
  lastValue = e.scrollTop;
  setShouldShowImages(e.scrollTop < 100 || delta < 2500);
}, 250);

export default function Slash() {
  const { getPosts, posts, meta, cache, patchPost, delPost } = useContext(
    Posts,
  );
  const { tags } = useContext(Tag);
  // const { user } = useContext(User);
  // const [query, setQuery] = useState(null);
  const [isEditing, setEditing] = useState(false);
  const [shouldShowImages, setShouldShowImages] = useState(true);
  const listRef = useRef(null);
  const throttledResize = throttle(() => {
    if (listRef.current) {
      cache.clearAll();
    }
  }, 250);

  window.addEventListener('resize', throttledResize);
  useEffect(() => {
    getPosts(1);
    return () => window.removeEventListener('resize', throttledResize);
  }, []);

  useEffect(
    () => {
      cache.clearAll();
      listRef.current.recomputeRowHeights(0);
    },
    [isEditing],
  );

  const handlePatchPost = id => async values => {
    await patchPost(id)(values);
    try {
      listRef.current.forceUpdate();
      setEditing(false);
    } catch (e) {
      log.error(e);
    }
  };

  // const delPost = id => async () => {
  //   await request.delete(`${API_PATH}/posts/${id}`);
  //   setCacheValid(false);
  //   await getPosts(1);

  //   cache.clearAll();
  //   listRef.forceUpdateGrid();
  // };

  // const getProps = (description, id) =>
  //   isEditing
  //     ? { initial: { [DESCRIPTION]: description }, onSubmit: handleSubmit(id) }
  //     : {};

  function isRowLoaded({ index }) {
    return !!posts[index];
  }

  function loadMoreRows() {
    return getPosts();
  }

  const handleScroll = onChildScroll => e => {
    onChildScroll(e);
    throttled(e, setShouldShowImages);
  };
  return (
    <Wrapper>
      <Title center size="large">
        Carpe Dalan
      </Title>
      <WindowScroller>
        {({ height, isScrolling, registerChild, onChildScroll, scrollTop }) => (
          <AutoSizer disableHeight>
            {({ width }) => (
              <InfiniteLoader
                isRowLoaded={isRowLoaded}
                loadMoreRows={loadMoreRows}
                rowCount={meta.count}
              >
                {({
                  onRowsRendered /* , registerChild: registerInfiniteChild */,
                }) => (
                  <div ref={registerChild}>
                    <List
                      width={width}
                      height={height}
                      autoHeight
                      ref={listRef}
                      onRowsRendered={onRowsRendered}
                      deferredMeasurementCache={cache}
                      onScroll={handleScroll(onChildScroll)}
                      rowHeight={cache.rowHeight}
                      rowRenderer={PostRenderer}
                      rowCount={meta.count}
                      overscanRowCount={10}
                      isScrolling={isScrolling}
                      scrollTop={scrollTop}
                      posts={posts}
                      cache={cache}
                      shouldShowImages={shouldShowImages}
                      size={MEDIUM}
                      showDescription
                      isAdmin
                      setEditing={setEditing}
                      isEditing={isEditing}
                      delPost={delPost}
                      patchPost={handlePatchPost}
                      tags={tags}
                    />
                  </div>
                )}
              </InfiniteLoader>
            )}
          </AutoSizer>
        )}
      </WindowScroller>
    </Wrapper>
  );
}
