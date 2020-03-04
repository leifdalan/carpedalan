import debug from 'debug';
import { useContext, useEffect, useCallback } from 'react';

import { client } from 'utils/ApiClient';
import { DataContext, Data } from 'providers/Data';

import useApi from './useApi';

const log = debug('hooks:useTags');

/**
 * Return values for useTag hook
 *
 * @interface UseTags
 */
export interface UseTags {
  /**
   * Actual tags returned from global data store
   *
   * @type {Data['tags']}
   * @memberof UseTags
   */
  tags: Data['tags'];
  /**
   * Argumentless action to execute fetch tags
   *
   * @memberof UseTags
   */
  fetchTags: (arg?: unknown) => Promise<void>;
}

export default function useTags(): UseTags {
  const { response, request } = useApi(client.getTags);
  const fetchTags = useCallback(
    arg => {
      return request(arg);
    },
    [request],
  );
  const { setTags, data } = useContext(DataContext);
  useEffect(() => {
    if (response) {
      setTags(response);
    }
  }, [response, setTags]);

  return {
    tags: data.tags,
    fetchTags,
  };
}
