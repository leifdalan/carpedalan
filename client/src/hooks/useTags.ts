import debug from 'debug';
import { useEffect, useCallback, useState } from 'react';

import { client } from 'ApiClient';

import useApi from './useApi';

const log = debug('hooks:useTags');

/* eslint-disable no-underscore-dangle */
const { tags } = window.__META__;

export default function useTags() {
  const { response, request } = useApi(client.getTags);
  const [tagsState, setTags] = useState(tags);
  const fetchTags = useCallback(
    arg => {
      return request(arg);
    },
    [request],
  );
  useEffect(() => {
    if (response) {
      setTags(response);
    }
  }, [response, setTags]);

  return {
    tags: tagsState,
    fetchTags,
  };
}
