import React, { createContext, useState } from 'react';
import { node } from 'prop-types';
import request from 'superagent';

import { API_PATH } from '../../shared/constants';
import log from '../utils/log';

export const Tag = createContext({ tags: [], postNewTag: () => {} });

const Tags = ({ children }) => {
  const [tags, setTags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(false);
  const [creatingTag, setCreatingTag] = useState(false);

  const loadTags = async () => {
    // Super basic caching - don't get tags if we already have them.
    if (tags.length) return;
    try {
      setLoadingTags(true);
      const response = await request.get(`${API_PATH}/tags`);
      setTags(response.body);
    } catch (e) {
      log.error('loading failed');
    } finally {
      setLoadingTags(false);
    }
  };

  const postNewTag = async tag => {
    setCreatingTag(true);
    try {
      const { body } = await request.post(`${API_PATH}/tags`, { tag });
      setTags([...tags, body]);
      return body;
    } catch (e) {
      log.error('bad request', e);
    } finally {
      setCreatingTag(false);
    }
    return null;
  };

  return (
    <Tag.Provider
      value={{ tags, loadTags, loadingTags, postNewTag, creatingTag }}
    >
      {children}
    </Tag.Provider>
  );
};

Tags.propTypes = {
  children: node.isRequired,
};

export default Tags;
