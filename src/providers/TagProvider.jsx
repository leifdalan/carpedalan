import React, { createContext, useState } from 'react';
import { node } from 'prop-types';
import request from 'superagent';

import log from '../utils/log';

export const Tag = createContext({ tags: [], postNewTag: () => {} });

const Tags = ({ children }) => {
  const [tags, setTags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(false);
  const postNewTag = async () => {
    setLoadingTags(true);
  };

  const loadTags = async () => {
    // Super basic caching - don't get tags if we already have them.
    if (tags.length) return;
    try {
      setLoadingTags(true);
      const response = await request.get('/api/tags');
      setTags(response.body);
    } catch (e) {
      log.error('loading failed');
    } finally {
      setLoadingTags(false);
    }
  };

  return (
    <Tag.Provider value={{ tags, loadTags, loadingTags, postNewTag }}>
      {children}
    </Tag.Provider>
  );
};

Tags.propTypes = {
  children: node.isRequired,
};

export default Tags;
