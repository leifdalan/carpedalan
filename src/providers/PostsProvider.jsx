import React, { createContext, useContext, useState } from 'react';
import { node } from 'prop-types';
import { stringify } from 'qs';
import { CellMeasurerCache } from 'react-virtualized';
import request from 'superagent';

import { API_PATH, DEFAULT_POSTS_PER_PAGE } from '../../shared/constants';
import log from '../utils/log';
import { performance } from '../utils/globals';

import { Window } from './WindowProvider';
import addPlaceholderColor from './postUtils';

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
        return addPlaceholderColor(
          posts[key][index - DEFAULT_POSTS_PER_PAGE * key],
        );
      }
      return fake;
    });
    return fakesWithPosts;
  }, allFakes);

  return postsWithFakes;

  // [
  //   ...posts,
  //   ...[...Array(meta.count - posts.length).keys()]
  //     .map(() => ({ fake: true }))
  //     .map(addPlaceholderColor),
  // ]
};

const PostProvider = ({ children }) => {
  const { width } = useContext(Window);
  const [posts, setPosts] = useState({});
  const [postsWithFakes, setPostsWithFakes] = useState([]);
  const [meta, setMeta] = useState({ count: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [progressMap, setProgressMap] = useState({});

  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: width,
  });

  const patchPost = id => async values => {
    try {
      const { body } = await request.patch(`${API_PATH}/posts/${id}`, values);
      setPosts(posts.map(post => (post.id === body.id ? body : post)));
      cache.clearAll();
    } catch (e) {
      log.error(e);
    }
  };

  const delPost = id => async () => {
    await request.delete(`${API_PATH}/posts/${id}`);
    setPosts(posts.filter(post => post.id !== id));
    cache.clearAll();
  };

  const getPosts = async (page = currentPage) => {
    try {
      const pageQuery = {
        page,
      };

      // Some super basic caching - don't refetch if we have already.
      if (posts[page - 1]) return null;
      const apiCall = request.get(`${API_PATH}/posts?${stringify(pageQuery)}`);
      const response = await apiCall;
      const newPosts = {
        ...posts,
        [page - 1]: response.body.data.map(addPlaceholderColor),
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

  const invalidateAll = () => {
    cache.clearAll();
    setPosts({});
    setMeta({ count: 0 });
  };

  const createPost = async (formData, index = 0) => {
    try {
      let afterUploadStart;
      const response = await request
        .post(`${API_PATH}/posts`)
        .send(formData)
        .on('progress', e => {
          if (e.percent) {
            setProgressMap({ ...progressMap, [index]: e.percent });
            console.error('progress', e.percent); // eslint-disable-line
            if (e.percent === 100) {
              afterUploadStart = performance.now();
            }
          }
        });
      const timeEnd = performance.now();
      invalidateAll();
      const processTime = timeEnd - afterUploadStart;
      console.error('processTime', processTime); // eslint-disable-line

      return { response: response.body, processTime };
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
        progressMap,
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
