import { RefObject, useEffect, useRef } from 'react';

export const on = (
  obj: Element | Document,
  ...args: Parameters<Element['addEventListener']>
) => obj.addEventListener(...args);

export const off = (
  obj: Element | Document,
  ...args: Parameters<Element['addEventListener']>
) => obj.removeEventListener(...args);

const defaultEvents = ['mousedown', 'touchstart'];

interface HandlerI extends Event {
  target: Node;
}

const useClickAway = <E extends HandlerI = HandlerI>(
  ref: RefObject<HTMLElement | null>,
  onClickAway: (event: E) => void,
  events: string[] = defaultEvents,
) => {
  const savedCallback = useRef(onClickAway);
  useEffect(() => {
    savedCallback.current = onClickAway;
  }, [onClickAway]);
  useEffect(() => {
    /**
     * @TODO figure out this any
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = (event: any) => {
      const { current: el } = ref;
      el && !el.contains(event.target) && savedCallback.current(event);
    };
    for (const eventName of events) {
      on(document, eventName, handler);
    }
    return () => {
      for (const eventName of events) {
        off(document, eventName, handler);
      }
    };
  }, [events, ref]);
};

export default useClickAway;
