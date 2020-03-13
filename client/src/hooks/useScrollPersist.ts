import debug from 'debug';
import { useRef, useEffect, useCallback, useState, RefObject } from 'react';
import ReactWindow, { ListOnItemsRenderedProps } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

import useCallbackRef from 'hooks/useCallbackRef';
import useLocalStorage from 'hooks/useLocalStorage';

import { PostsWithTagsWithFakes } from './types';

const log = debug('hooks:useScrollPersist');

interface LoadedInfiniteLoaderType extends InfiniteLoader {
  _listRef: ReactWindow.VariableSizeList;
}

export default function useScrollPersist(
  key: string,
  dep: PostsWithTagsWithFakes[],
) {
  const [scrollIndex, setScrollIndex] = useLocalStorage<number>(key, 0);
  const localScroll = useRef(scrollIndex);
  const [isMounted, setIsMounted] = useState(false);
  const refCallback = useCallback((ref: LoadedInfiniteLoaderType | null) => {
    if (ref) setIsMounted(true);
  }, []);
  const [hasPersisted, setHasPersisted] = useState(false);
  const infiniteRef = useCallbackRef<LoadedInfiniteLoaderType>(
    null,
    refCallback,
  );

  useEffect(() => {
    if (dep.length > 1 && !hasPersisted && isMounted) {
      log('scrollingTo', scrollIndex, dep.length);
      log('hasPersisted', hasPersisted);
      setHasPersisted(true);
      infiniteRef?.current?._listRef?.scrollToItem?.(scrollIndex, 'center');
    }
  }, [dep, hasPersisted, infiniteRef, isMounted, scrollIndex]);

  useEffect(() => {
    return () => {
      log('current', localScroll.current);
      if (localScroll.current > 1) setScrollIndex(localScroll.current);
    };
  }, [setScrollIndex]);

  const handleScroll = useCallback(
    (rendered: ListOnItemsRenderedProps) => {
      if (rendered.visibleStartIndex > 1) {
        localScroll.current = rendered.visibleStartIndex;
        setScrollIndex(localScroll.current);
      }
      log('current', localScroll.current);
    },
    [setScrollIndex],
  );

  return {
    infiniteRef: infiniteRef as RefObject<LoadedInfiniteLoaderType>,
    handleScroll,
  };
}
