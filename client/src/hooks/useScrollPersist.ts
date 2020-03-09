import throttle from 'lodash/throttle';
import { useRef, useEffect, useCallback, RefObject } from 'react';
import ReactWindow from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

import useCallbackRef from 'hooks/useCallbackRef';
import useLocalStorage from 'hooks/useLocalStorage';

interface LoadedInfiniteLoaderType extends InfiniteLoader {
  _listRef: ReactWindow.VariableSizeList;
}

export default function useScrollPersist(key: string) {
  const localScroll = useRef(0);
  const [scrollPos, setScrollPos] = useLocalStorage<number>(key, 0);
  const refCallback = useCallback(
    (ref: LoadedInfiniteLoaderType | null) => {
      ref?._listRef?.scrollTo?.(scrollPos); // eslint-disable-line no-unused-expressions
    },
    [scrollPos],
  );
  const infiniteRef = useCallbackRef<LoadedInfiniteLoaderType>(
    null,
    refCallback,
  );
  useEffect(() => {
    return () => setScrollPos(localScroll.current);
  }, [setScrollPos]);

  const handleScroll = useCallback(
    (onScroll: ReactWindow.ListOnScrollProps) => {
      const throttled = throttle(
        ({ scrollOffset }: ReactWindow.ListOnScrollProps) => {
          if (scrollOffset !== 0) localScroll.current = scrollOffset;
        },
        1000,
      );
      return throttled(onScroll);
    },
    [],
  );

  return {
    infiniteRef: infiniteRef as RefObject<InfiniteLoader>,
    handleScroll,
  };
}
