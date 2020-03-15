import { useEffect, useRef, useState } from 'react';

import useUnmount from './useUnmount';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const useThrottleFn = <T, U extends any[]>(
  fn: (...args: U) => T,
  ms = 200,
  args: U,
) => {
  const [state, setState] = useState<T | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const nextArgs = useRef<U>();

  useEffect(() => {
    if (!timeout.current) {
      setState(fn(...args));
      const timeoutCallback = () => {
        if (nextArgs.current) {
          setState(fn(...nextArgs.current));
          nextArgs.current = undefined;
          timeout.current = setTimeout(timeoutCallback, ms);
        } else {
          timeout.current = undefined;
        }
      };
      timeout.current = setTimeout(timeoutCallback, ms);
    } else {
      nextArgs.current = args;
    }
  }, [args, fn, ms]);

  useUnmount(() => {
    timeout.current && clearTimeout(timeout.current);
  });

  return state;
};

export default useThrottleFn;
