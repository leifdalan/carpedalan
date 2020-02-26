import debug from 'debug';
import { useState, useCallback } from 'react';

import { ErrorI } from 'ApiClient';

const log = debug('hooks:useApi');

/**
 * Custom hook to manage error and loading states throughout an APIs
 * execution lifecycle
 *
 * @export
 * @template T
 * @template U
 * @param {((args: T) => Promise<U>)} action
 * @returns
 */
export default function useApi<T, U>(action: (args: T | never) => Promise<U>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorI | null>(null);
  const [response, setResponse] = useState<U>();

  /**
   *
   *
   * @param {(T | never)} arg
   */
  async function requestFunc(arg: T | never) {
    try {
      setLoading(true);
      const res = await action(arg);
      setLoading(false);
      setResponse(res);
    } catch (e) {
      setLoading(false);
      setError(e);
    }
  }
  const request = useCallback(requestFunc, []);
  return { loading, request, error, response };
}
