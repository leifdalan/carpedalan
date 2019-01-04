import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  AutoSizer,
  CellMeasurerCache,
  List,
  InfiniteLoader,
  WindowScroller,
} from 'react-virtualized';

import { THUMB } from '../../shared/constants';
import { Posts } from '../providers/PostsProvider';
import PostGridRowRenderer from '../components/PostGridRowRenderer';

// Default sizes help Masonry decide how many images to batch-measure
const cache = new CellMeasurerCache({
  defaultHeight: 100,
  defaultWidth: 100,
  fixedWidth: true,
});

export default function Archive() {
  const { getPosts, posts, meta } = useContext(Posts);
  const [loading, setLoading] = useState(false);
  // const { user } = useContext(User)
  // const [query, setQuery] = useState(null);
  // const [isEditing, setEditing] = useState(false);
  const listRef = useRef(null);
  useEffect(() => {
    getPosts(1);
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
  const POST_WIDTH = 100;
  const isRowLoaded = width => ({ index }) =>
    !!posts[index * Math.floor(width / POST_WIDTH)];

  async function loadMoreRows() {
    if (!loading) {
      setLoading(true);
      await getPosts();
      setLoading(false);
    }
  }

  return (
    <div>
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
                        overscanRowCount={5}
                        isScrolling={isScrolling}
                        scrollTop={scrollTop}
                        posts={posts}
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
