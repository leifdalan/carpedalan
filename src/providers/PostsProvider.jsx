import React, { createContext, useState } from 'react';
import { node } from 'prop-types';
import { stringify } from 'qs';
import { CellMeasurerCache } from 'react-virtualized';
import request from 'superagent';

import { API_PATH } from '../../shared/constants';
import log from '../utils/log';

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

  const getPosts = async (page = currentPage) => {
    try {
      const pageQuery = {
        page,
      };
      // Some super basic caching - don't refetch if we have already.
      if (posts[page * 100]) return null;
      const apiCall = request.get(`${API_PATH}/posts?${stringify(pageQuery)}`);
      const response = await apiCall;
      setPosts([...posts, ...response.body.data]);
      setMeta(response.body.meta);
      setCurrentPage(currentPage + 1);
    } catch (e) {
      log.error('loading failed');
    }
    return null;
  };

  return (
    <Posts.Provider value={{ cache, getPosts, posts, meta }}>
      {children}
    </Posts.Provider>
  );
};

PostProvider.propTypes = {
  children: node.isRequired,
};

export default PostProvider;
