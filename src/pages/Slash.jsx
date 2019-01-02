import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  AutoSizer,
  InfiniteLoader,
  List,
  WindowScroller,
} from 'react-virtualized';
import throttle from 'lodash/throttle';

// import { User } from '..';

import { Posts } from '../providers/PostsProvider';
import PostRenderer from '../components/PostRenderer';

let lastValue = 0;
const throttled = throttle((e, setShouldShowImages) => {
  const delta = Math.abs(e.scrollTop - lastValue);
  lastValue = e.scrollTop;
  setShouldShowImages(delta < 1500);
}, 250);

export default function Slash() {
  const { getPosts, posts, meta, cache } = useContext(Posts);
  // const { user } = useContext(User);
  // const [query, setQuery] = useState(null);
  // const [isEditing, setEditing] = useState(false);
  const [shouldShowImages, setShouldShowImages] = useState(true);
  const listRef = useRef(null);

  useEffect(() => {
    getPosts();
    // return null;
    const throttledResize = throttle(() => {
      cache.clear(0);
      listRef.current.recomputeRowHeights(0);
      listRef.current.forceUpdate();
    }, 250);

    window.addEventListener('resize', () => {
      throttledResize(listRef, cache);
    });
  }, []);

  // const Wrapper = isEditing ? Form : Fragment;

  // const handleSubmit = id => async values => {
  //   await request.patch(`${API_PATH}/posts/${id}`, values);
  // };

  // const del = id => async () => {
  //   await request.delete(`${API_PATH}/posts/${id}`);
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
    <div>
      <div style={{ fontSize: '82px' }}>
        asdfoijaf oijw efoiaj weofija woeifj aoweijf aowiejf
      </div>
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
                      overscanRowCount={5}
                      isScrolling={isScrolling}
                      scrollTop={scrollTop}
                      posts={posts}
                      cache={cache}
                      shouldShowImages={shouldShowImages}
                    />
                  </div>
                )}
              </InfiniteLoader>
            )}
          </AutoSizer>
        )}
      </WindowScroller>
    </div>
  );
}

/* <div onClick={() => setQuery({ order: 'asc' })}>sort wootdesc</div>
{posts.map(({ id, description, key, tags, width }) =>
  key ? (
    <Wrapper key={id} {...getProps(description, id)}>
      {width}
      <img
        alt={description}
        width="100%"
        data-test={key.split('/')[1]}
        src={`${API_IMAGES_PATH}/${SIZE_MAP[MEDIUM].width}/${
          key.split('/')[1]
        }.webp`}
      />
      {isEditing ? (
        <Field name={DESCRIPTION} component={InputField} />
      ) : (
        <div>{description || null}</div>
      )}

      {tags.map(({ name, id: tagId }) => (
        <Link key={tagId} to={`/tag/${name}`}>{`#${name}`}</Link>
      ))}
      {isAdmin(user) && !isEditing ? (
        <div onClick={() => setEditing(true)}>edit</div>
      ) : null}
      {isAdmin(user) && isEditing ? <Submit /> : null}
      {isAdmin(user) && isEditing ? (
        <div onClick={() => setEditing(false)}>unedit</div>
      ) : null}
      {isAdmin(user) && isEditing ? (
        <button type="button" onClick={del(id)}>
          del
        </button>
      ) : null}
    </Wrapper>
  ) : null,
)} */
