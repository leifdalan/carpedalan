import React, { createContext, useContext, useState } from 'react';
import { node } from 'prop-types';
import { stringify } from 'qs';
import { CellMeasurerCache } from 'react-virtualized/dist/es/CellMeasurer';

import { API_PATH, DEFAULT_POSTS_PER_PAGE } from '../../shared/constants';
import log from '../utils/log';
import { performance, FormData } from '../utils/globals';

import { API } from './APIProvider';
import { Window } from './WindowProvider';
import addPlaceholderColor from './postUtils';

let progressMap = {};
export const Posts = createContext({
  posts: [],
  getPosts: () => {},
  meta: {},
});

const addFakePosts = ({ posts, meta }) => {
  const allFakes = [...Array(meta.count).keys()]
    .map(() => ({ fake: true, tags: [] }))
    .map(addPlaceholderColor);

  const postsWithFakes = Object.keys(posts).reduce((acc, key) => {
    const fakesWithPosts = acc.map((fake, index) => {
      if (
        Number(key) * DEFAULT_POSTS_PER_PAGE <= index &&
        (Number(key) + 1) * DEFAULT_POSTS_PER_PAGE > index
      ) {
        return {
          ...fake,
          ...posts[key][index - DEFAULT_POSTS_PER_PAGE * key],
          fake: false,
        };
      }
      return fake;
    });
    return fakesWithPosts;
  }, allFakes);

  return postsWithFakes;
};

const PostProvider = ({ children }) => {
  const { width } = useContext(Window);
  const { patch, get, post, del } = useContext(API);
  const [posts, setPosts] = useState({});
  const [postsWithFakes, setPostsWithFakes] = useState([]);
  const [meta, setMeta] = useState({ count: 0 });
  const [progressState, setProgressState] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: width,
  });

  const patchPost = id => async values => {
    try {
      const { body } = await patch(`${API_PATH}/posts/${id}`, values);
      setPostsWithFakes(
        postsWithFakes.map(data => (data.id === body.id ? body : data)),
      );
      cache.clearAll();
    } catch (e) {
      log.error(e);
    }
  };

  const invalidateAll = () => {
    cache.clearAll();
    setPosts({});
    setMeta({ count: 0 });
  };

  const bulkEdit = async values => {
    try {
      const { body } = await patch(`${API_PATH}/posts/bulk`, values);
      invalidateAll();
      return body;
    } catch (e) {
      log.error(e);
      throw e;
    }
  };

  const bulkDelete = async values => {
    try {
      const { body } = await del(`${API_PATH}/posts/bulk`, values);
      invalidateAll();
      return body;
    } catch (e) {
      log.error(e);
      throw e;
    }
  };

  const delPost = id => async () => {
    await del(`${API_PATH}/posts/${id}`);
    setPostsWithFakes(postsWithFakes.filter(data => data.id !== id));
    cache.clearAll();
  };

  const getPosts = async (page = currentPage) => {
    try {
      const pageQuery = {
        page,
      };

      // Some super basic caching - don't refetch if we have already.
      if (posts[page - 1]) return null;
      const apiCall = get(`${API_PATH}/posts?${stringify(pageQuery)}`);
      const response = await apiCall;
      const newPosts = {
        ...posts,
        [page - 1]: response.body.data,
      };

      setMeta(response.body.meta);
      setPosts(newPosts);
      setCurrentPage(currentPage + 1);

      const finalPosts = addFakePosts({
        posts: newPosts,
        meta: response.body.meta,
      });

      setPostsWithFakes(finalPosts);
    } catch (e) {
      log.error('loading failed');
    }
    return null;
  };

  const createPost = async ({ description, tags, index = 0, file }) => {
    try {
      const { name, type } = file;
      const res = await get('/api/posts/upload', { type, name });
      const s3FormData = new FormData();
      Object.keys(res.body.params).forEach(key =>
        s3FormData.append(key, res.body.params[key]),
      );
      s3FormData.append('file', file);
      let afterUploadStart;
      await post(res.body.upload_url)
        .send(s3FormData)
        .on('progress', e => {
          if (e.percent) {
            progressMap = { ...progressMap, [index]: e.percent };
            setProgressState(progressMap);
            // console.error('progress', e.percent); // eslint-disable-line
            if (e.percent === 100) {
              afterUploadStart = performance.now();
            }
          }
        });
      const apiResponse = await post('/api/posts', { tags, description, name });
      const timeEnd = performance.now();
      invalidateAll();
      const processTime = timeEnd - afterUploadStart;

      return { response: apiResponse.body, processTime };
    } catch (e) {
      log.error(e);
      return Promise.reject(e);
    }
  };

  return (
    <Posts.Provider
      value={{
        cache,
        getPosts,
        posts: postsWithFakes,
        meta,
        patchPost,
        delPost,
        invalidateAll,
        createPost,
        progressMap: progressState,
        bulkEdit,
        bulkDelete,
      }}
    >
      {children}
    </Posts.Provider>
  );
};

PostProvider.propTypes = {
  children: node.isRequired,
};

export default PostProvider;
