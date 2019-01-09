import React, { createContext, useState } from 'react';
import { node } from 'prop-types';
import { stringify } from 'qs';
import { CellMeasurerCache } from 'react-virtualized';
import request from 'superagent';

import { API_PATH } from '../../shared/constants';
import log from '../utils/log';

import addPlaceholderColor from './postUtils';

export const Posts = createContext({
  posts: [],
  getPosts: () => {},
  meta: {},
});

const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [meta, setMeta] = useState({ count: 0 });
  const [currentPage, setCurrentPage] = useState(1);

  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 500,
  });

  const patchPost = id => async values => {
    try {
      const { body } = await request.patch(`${API_PATH}/posts/${id}`, values);
      setPosts(posts.map(post => (post.id === body.id ? body : post)));
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
      if (posts[page * 100]) return null;
      const apiCall = request.get(`${API_PATH}/posts?${stringify(pageQuery)}`);
      const response = await apiCall;
      setPosts([...posts, ...response.body.data].map(addPlaceholderColor));
      setMeta(response.body.meta);
      setCurrentPage(currentPage + 1);
    } catch (e) {
      log.error('loading failed');
    }
    return null;
  };

  const invalidateAll = () => {
    cache.clearAll();
    setPosts([]);
    setMeta({ count: 0 });
  };

  const createPost = async formData => {
    try {
      const { body } = await request
        .post(`${API_PATH}/posts`)
        .send(formData)
        .on('progress', e => {
          log.info('progress', e.percent);
        });
      invalidateAll();
      return body;
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
        posts,
        meta,
        patchPost,
        delPost,
        invalidateAll,
        createPost,
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
