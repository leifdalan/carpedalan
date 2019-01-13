import React, { createContext } from 'react';
import { node } from 'prop-types';
import { WindowScroller } from 'react-virtualized';

export const Window = createContext({
  height: 0,
  isScrolling: false,
  onChildScroll: () => {},
});
const WindowProvider = ({ children }) => (
  <WindowScroller>
    {({
      height,
      isScrolling,
      onChildScroll,
      registerChild,
      scrollTop,
      width,
    }) => (
      <Window.Provider
        value={{
          height,
          isScrolling,
          onChildScroll,
          registerChild,
          scrollTop,
          width,
        }}
      >
        {children}
      </Window.Provider>
    )}
  </WindowScroller>
);

WindowProvider.propTypes = {
  children: node.isRequired,
};

export default WindowProvider;
