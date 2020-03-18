import { useState, useCallback, useEffect } from 'react';
import { useSwipeable, SwipeCallback } from 'react-swipeable';

export interface Swipe {
  isSwiping: boolean;
  deltaX: number;
  hasSwipedLeft: boolean;
  hasSwipedRight: boolean;
}

let swipe: Swipe = {
  isSwiping: false,
  deltaX: 0,
  hasSwipedLeft: false,
  hasSwipedRight: false,
};

type SetSwipe = (u: Swipe) => void;

let setters: SetSwipe[] = [];

const setSwipe = (swipeVal: Swipe) => {
  setters.forEach(setter => {
    swipe = swipeVal;
    setter(swipe);
  });
};

export default function useGlobalSwipe() {
  const [, set] = useState(swipe);
  if (!setters.includes(set)) {
    setters.push(set);
  }

  useEffect(() => {
    return () => {
      setters = setters.filter((setter: SetSwipe) => setter !== set);
    };
  }, []);

  const handleSwiping = useCallback<SwipeCallback>(eventData => {
    setSwipe({
      isSwiping: true,
      deltaX: eventData.deltaX,
      hasSwipedRight: false,
      hasSwipedLeft: false,
    });
  }, []);

  const handleSwiped = useCallback<SwipeCallback>(eventData => {
    setSwipe({
      isSwiping: false,
      deltaX: eventData.deltaX,
      hasSwipedRight: false,
      hasSwipedLeft: false,
    });
  }, []);
  const handleSwipedRight = useCallback<SwipeCallback>(eventData => {
    setSwipe({
      isSwiping: false,
      deltaX: eventData.deltaX,
      hasSwipedRight: true,
      hasSwipedLeft: false,
    });
  }, []);
  const handleSwipedLeft = useCallback<SwipeCallback>(eventData => {
    setSwipe({
      isSwiping: false,
      deltaX: eventData.deltaX,
      hasSwipedLeft: true,
      hasSwipedRight: false,
    });
  }, []);

  const handlers = useSwipeable({
    onSwiping: handleSwiping,
    onSwiped: handleSwiped,
    onSwipedLeft: handleSwipedLeft,
    onSwipedRight: handleSwipedRight,
  });

  return {
    handlers,
    swipe,
  };
}
