import debug from 'debug';
import { useRef, useEffect, useCallback, useState, RefObject } from 'react';
import {
  ListOnItemsRenderedProps,
  VariableSizeList,
  ListOnScrollProps,
} from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

import useCallbackRef from 'hooks/useCallbackRef';
import useLocalStorage from 'hooks/useLocalStorage';

import { PostsWithTagsWithFakes } from './types';

const log = debug('hooks:useScrollPersist');

export interface LoadedInfiniteLoaderType extends InfiniteLoader {
  _listRef: VariableSizeList;
}

type SetScrollTo = (scrollTo: VariableSizeList) => void;

const setters = new Set<SetScrollTo>();

const setScrollTo = (scrollTo: VariableSizeList) => {
  for (const setter of setters) {
    setter(scrollTo);
  }
};

export default function useScrollPersist(
  key: string,
  dep: PostsWithTagsWithFakes[],
) {
  const [scrollIndex, setScrollIndex] = useLocalStorage<number>(key, 0);
  const [scrollPos, setScrollPos] = useLocalStorage<number>(key, 0);
  const [scrollTo, set] = useState<VariableSizeList | null>(null);
  if (!setters.has(set)) setters.add(set);
  const originalScroll = useRef(scrollIndex);
  const currentScrollPos = useRef(scrollPos);
  const [hasMoved, setHasMoved] = useState(false);
  const localScroll = useRef(scrollIndex);
  const [isMounted, setIsMounted] = useState(false);
  const [velocity, setVelocity] = useState(0);
  const refCallback = useCallback((ref: LoadedInfiniteLoaderType | null) => {
    if (ref) {
      /* eslint-disable-next-line no-underscore-dangle */
      setScrollTo(ref._listRef);
      setIsMounted(true);
    }
  }, []);
  const [hasPersisted, setHasPersisted] = useState(false);
  const infiniteRef = useCallbackRef<LoadedInfiniteLoaderType>(
    null,
    refCallback,
  );

  useEffect(() => {
    if (dep.length > 1 && !hasMoved && isMounted) {
      log('scrollingTo', scrollIndex, dep.length);
      log('hasPersisted', hasPersisted);
      setHasPersisted(true);
      infiniteRef?.current?._listRef?.scrollToItem?.(scrollIndex, 'center');
    }
  }, [dep, hasMoved, hasPersisted, infiniteRef, isMounted, scrollIndex]);

  useEffect(() => {
    return () => {
      log('current', localScroll.current);
      if (localScroll.current > 1) {
        setScrollIndex(localScroll.current);
      }
    };
  }, [setScrollIndex]);

  const handleItemRendered = useCallback(
    (rendered: ListOnItemsRenderedProps) => {
      if (rendered.visibleStartIndex > 1) {
        localScroll.current = Math.floor(
          (rendered.visibleStartIndex + rendered.visibleStopIndex) / 2,
        );

        if (localScroll.current !== originalScroll.current && !hasMoved) {
          setHasMoved(true);
        }

        setScrollIndex(localScroll.current);
      }
    },
    [hasMoved, setScrollIndex],
  );

  const handleScroll = useCallback(
    (props: ListOnScrollProps) => {
      setScrollPos(props.scrollOffset);
      currentScrollPos.current = props.scrollOffset;
    },
    [setScrollPos],
  );

  useEffect(() => {
    const old = scrollPos;
    setTimeout(() => {
      const speed = Math.abs((currentScrollPos.current - old) / 10);
      setVelocity(speed);
    }, 100);
    // return () => clearTimeout(timeout);
  }, [scrollPos]);

  return {
    infiniteRef: infiniteRef as RefObject<LoadedInfiniteLoaderType>,
    handleItemRendered,
    handleScroll,
    hasPersisted,
    scrollIndex,
    scrollTo,
    scrollPos,
    velocity,
    hasMoved,
  };
}
