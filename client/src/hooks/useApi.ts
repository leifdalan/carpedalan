import debug from 'debug';
import { useState, useEffect, useCallback } from 'react';

import { ErrorI } from 'ApiClient';
import { RetryTuple, RequestObject } from 'hooks/types';
import useToast from 'hooks/useToast';

interface ApiState {
  isLoading: boolean;
  error: ErrorI | null;
  retryRequest?: RetryTuple;
}
let globalApiState: ApiState;
type SetGlobalApiState = (apiState: ApiState) => void;

let setters: SetGlobalApiState[] = [];

function setGlobalApiState(apiState: ApiState) {
  setters.forEach(setter => {
    globalApiState = apiState;
    setter(globalApiState);
  });
}

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
export default function useApi<U>(
  action?: (args: RequestObject | never) => Promise<U>,
) {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const [error, setError] = useState<ErrorI | null>(null);
  const [response, setResponse] = useState<U>();
  const [apiState, setApiState] = useState<ApiState>({
    isLoading: false,
    error: null,
  });

  if (!setters.includes(setApiState)) {
    setters.push(setApiState);
  }

  useEffect(() => {
    return () => {
      setters = setters.filter(setter => setter !== setApiState);
    };
  }, [setApiState]);
  /**
   *
   *
   * @param {(T | never)} arg
   */

  const requestFunc = useCallback(
    async (arg: RequestObject) => {
      try {
        setLoading(true);
        setGlobalApiState({
          ...globalApiState,
          isLoading: true,
        });
        const res = await action?.(arg);
        setGlobalApiState({
          ...globalApiState,
          isLoading: false,
        });

        setLoading(false);
        setResponse(res);
      } catch (e) {
        setLoading(false);
        setGlobalApiState({
          ...globalApiState,
          isLoading: false,
          retryRequest: [requestFunc, arg],
        });
        addToast({
          message: e.message || 'Oops, something went wrong.',
          retryTuple: [requestFunc, arg],
        });

        setError(e);
      }
    },
    [action, addToast],
  );

  return { loading, request: requestFunc, error, response, apiState };
}
