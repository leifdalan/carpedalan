/* eslint-disable import/no-duplicates */
import { useThrottleCallback } from '@react-hook/throttle';
import addMonths from 'date-fns/fp/addMonths';
import format from 'date-fns/fp/format';
import fromUnixTime from 'date-fns/fp/fromUnixTime';
import getMonth from 'date-fns/fp/getMonth';
import debug from 'debug';
import flow from 'lodash/fp/flow';
import React, {
  useCallback,
  useMemo,
  RefObject,
  MouseEventHandler,
  Fragment,
  useEffect,
  useState,
} from 'react';
import { useRef } from 'react';
import { useSwipeable, SwipeCallback } from 'react-swipeable';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';

import usePosts from 'hooks/usePosts';
import { LoadedInfiniteLoaderType } from 'hooks/useScrollPersist';
import { propTrueFalse } from 'styles/utils';

const isJanuary = flow(Number, fromUnixTime, getMonth, number => number === 1);
const formatDate = flow(fromUnixTime, format(`yyyy`));

const log = debug('components:ScrollHandle');

const Point = styled.div`
  position: absolute;
  right: 5px;
  height: 10px;
  width: 10px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 100%;
  z-index: 100001;
`;

const Thumbtab = styled.div`
  height: 70px;
  width: 70px;
  color: red;
  border-radius: 100%;
  margin-top: -25px;
  position: fixed;
  right: -10px;
  background: rgba(0, 0, 0, 0.6);
  z-index: 100001;
  &:after {
    content: '▲';
    position: absolute;
    top: 11px;
    right: 28px;
    color: #9e9191;
  }
  &:before {
    content: '▼';
    position: absolute;
    top: 60%;
    right: 39%;
    color: #9e9191;
  }
`;

const Label = styled.div`
  position: absolute;
  right: 15px;
  z-index: 100001;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  padding: 10px;
  border-radius: 20px;
  font-size: 12px;
  text-align: center;
`;

interface ScrollHandleI {
  infiniteRef: RefObject<LoadedInfiniteLoaderType>;
  scrollPos: number;
  windowHeight: number;
  containerHeight: number;
  setIsUsingScrollHandle: (arg: boolean) => void;
  isUsingScrollHandle: boolean;
  scrollVelocity: number;
  hasMoved: boolean;
  disableClickAction?: boolean;
}

const WIDTH = '80px';
const CLASS_PREFIX = 'handle';
const TRANSITION_SPEED = 400;
const TRANSITION_SPEED_MS = `${TRANSITION_SPEED}ms`;

interface HandleWrapperI {
  disableEvents?: boolean;
}
const HandleWrapper = styled.div<HandleWrapperI>`
  pointer-events: ${propTrueFalse('disableEvents', 'none', 'inherit')};
  position: fixed;
  top: 0;
  right: 0px;
  height: 100%;
  width: ${WIDTH};
  /* background: rgb(2, 0, 36); */
  /* background: linear-gradient(
    88deg,
    rgba(2, 0, 36, 0) 8%,
    rgba(255, 255, 255, 0.7749474789915967) 77%
  ); */
  z-index: 1;
  transition: opacity ${TRANSITION_SPEED_MS} ease-out,
    transform ${TRANSITION_SPEED_MS} ease-out;
  &.${CLASS_PREFIX}-enter {
    opacity: 0;
    transform: translateX(${WIDTH});
  }
  &.${CLASS_PREFIX}-enter-active {
    transform: translateX(0px);
    opacity: 1;
  }
  &.${CLASS_PREFIX}-enter-done {
    transform: translateX(0px);
    opacity: 1;
  }
  &.${CLASS_PREFIX}-exit {
    opacity: 1;
    transform: translateX(0px);
  }
  &.${CLASS_PREFIX}-exit-active {
    opacity: 0;
    transform: translateX(${WIDTH});
  }
  &.${CLASS_PREFIX}-exit-done {
    transform: translateX(0px);
    opacity: 1;
    right: -${WIDTH};
  }
  overscroll-behavior-y: contain;
`;

const ControlWrapper = styled.div`
  position: fixed;
  z-index: 1;
  right: 0;
`;

interface FrequencyByMonthI {
  [timestamp: string]: number;
}

interface PixelToMonth {
  top: number;
  label: string;
  isJanuary: boolean;
  monthUnix: number;
}

export default function ScrollHandle({
  infiniteRef,
  scrollPos,
  windowHeight,
  containerHeight,
  setIsUsingScrollHandle,
  isUsingScrollHandle,
  scrollVelocity,
  hasMoved,
  disableClickAction,
}: ScrollHandleI) {
  const top = (scrollPos / containerHeight) * windowHeight;
  const { meta } = usePosts();

  const [shouldShow, setShouldShow] = useState(false);
  const { frequencyByMonth, count } = meta;
  const pixelScaleFactor = windowHeight / count;
  const ref = useRef(null);

  const pixelToMonthMap = useMemo(() => {
    let sum = 0;
    return Object.keys(frequencyByMonth as FrequencyByMonthI)
      .reverse()
      .reduce<PixelToMonth[]>((acc, key) => {
        sum += frequencyByMonth[key];
        return [
          ...acc,
          {
            top: Math.floor(sum * pixelScaleFactor),
            label: formatDate(Number(key)),
            isJanuary: isJanuary(key),
            monthUnix: Number(key),
          },
        ];
      }, []);
  }, [frequencyByMonth, pixelScaleFactor]);

  const getDate = useMemo(() => {
    return flow(
      pos => pixelToMonthMap.find(({ top }) => top > pos)?.monthUnix ?? 0,
      fromUnixTime,
      addMonths(-1),
      format('MMM yyyy'),
    );
  }, [pixelToMonthMap]);

  const handleSwiping = useCallback<SwipeCallback>(
    event => {
      setIsUsingScrollHandle(true);
      infiniteRef?.current?._listRef.scrollTo(
        ((event.initial[1] - event.deltaY) * containerHeight) / windowHeight,
      );
    },
    [containerHeight, infiniteRef, setIsUsingScrollHandle, windowHeight],
  );

  const throttledHandleSwiping = useThrottleCallback(handleSwiping, 30);

  const handleClick = useCallback<MouseEventHandler>(
    e => {
      if (disableClickAction) return;
      infiniteRef?.current?._listRef.scrollTo(
        (e.pageY * containerHeight) / windowHeight,
      );
    },
    [containerHeight, disableClickAction, infiniteRef, windowHeight],
  );

  const handleSwiped = useCallback<SwipeCallback>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event => {
      setIsUsingScrollHandle(false);
    },
    [setIsUsingScrollHandle],
  );

  const handlers = useSwipeable({
    onSwiping: throttledHandleSwiping,
    onSwiped: handleSwiped,
    trackMouse: true,
    preventDefaultTouchmoveEvent: true,
  });

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (scrollVelocity > 40 && hasMoved) {
      setShouldShow(true);
    } else if (shouldShow) {
      timeout = setTimeout(() => {
        setShouldShow(false);
      }, 5000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [hasMoved, scrollVelocity, shouldShow]);

  return (
    <CSSTransition
      in={shouldShow}
      classNames={CLASS_PREFIX}
      timeout={TRANSITION_SPEED}
      unmountOnExit
    >
      <ControlWrapper>
        <HandleWrapper onClick={handleClick} disableEvents={disableClickAction}>
          <div ref={ref}>
            {pixelToMonthMap.map((point, index) => (
              <Fragment key={index}>
                <Point style={{ top: `${point.top}px` }} />
                {point.isJanuary ? (
                  <Label style={{ top: `${point.top}px` }}>{point.label}</Label>
                ) : null}
              </Fragment>
            ))}

            {isUsingScrollHandle || scrollVelocity ? (
              <Label style={{ top: `${top - 60}px`, right: '0px' }}>
                {getDate(top)}
              </Label>
            ) : null}
          </div>
        </HandleWrapper>
        <Thumbtab style={{ top: `${top}px` }} {...handlers} />
      </ControlWrapper>
    </CSSTransition>
  );
}
