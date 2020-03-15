import debug from 'debug';
import React, { useCallback, useState, RefObject } from 'react';
import { useSwipeable, SwipeCallback } from 'react-swipeable';
import { VariableSizeList } from 'react-window';
import styled from 'styled-components';

import { LoadedInfiniteLoaderType } from 'hooks/useScrollPersist';

const log = debug('components:ScrollHandle');

interface ScrollHandleI {
  infiniteRef: RefObject<LoadedInfiniteLoaderType>;
  scrollPos: number;
  windowHeight: number;
  containerHeight: number;
  setIsUsingScrollHandle: (arg: boolean) => void;
}

const Handle = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 75px;
  height: 75px;
  background: red;
  z-index: 1000;
`;

export default function ScrollHandle({
  infiniteRef,
  scrollPos,
  windowHeight,
  containerHeight,
  setIsUsingScrollHandle,
}: ScrollHandleI) {
  log('HEIGHT', containerHeight);
  const top = (scrollPos / containerHeight) * windowHeight;
  const handleSwiping = useCallback<SwipeCallback>(
    event => {
      log('top', top);
      log('event', event.absY);
      log('delta', event.initial);
      setIsUsingScrollHandle(true);
      infiniteRef?.current?._listRef.scrollTo(
        ((event.initial[1] - event.deltaY) * containerHeight) / windowHeight,
      );
    },
    [containerHeight, infiniteRef, setIsUsingScrollHandle, top, windowHeight],
  );

  const handleSwiped = useCallback<SwipeCallback>(
    event => {
      setIsUsingScrollHandle(false);
    },
    [setIsUsingScrollHandle],
  );
  // log('scroll', (scrollPos / 5155680) * windowHeight);
  const handlers = useSwipeable({
    onSwiping: handleSwiping,
    onSwiped: handleSwiped,
  });
  return <Handle style={{ top: `${top}px` }} {...handlers} />;
}
