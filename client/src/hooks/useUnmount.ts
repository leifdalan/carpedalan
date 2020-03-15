import { useRef, useEffect } from 'react';
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const useUnmount = (fn: () => any): void => {
  const fnRef = useRef(fn);

  // update the ref each render so if it change the newest callback will be invoked
  fnRef.current = fn;

  useEffect(() => () => fnRef.current(), []);
};

export default useUnmount;
