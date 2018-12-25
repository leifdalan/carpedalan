import React, { createContext, useState } from 'react';
import request from 'superagent';

import log from '../utils/log';

export const Tag = createContext({ tags: [], postNewTag: () => {} });

export default ({ children }) => {
  const [tags, setTags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(false);
  const postNewTag = async tag => {
    setLoadingTags(true);
  };

  const loadTags = async () => {
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
