import React, { createContext, useEffect, useState } from 'react';
import { node } from 'prop-types';
import debounce from 'lodash/debounce';

import { window } from '../utils/globals';

export const Window = createContext({});
const WindowProvider = ({ children }) => {
  const [width, setWidth] = useState(null);

  useEffect(() => {
    setWidth(window.innerWidth);
    const debounced = debounce(() => {
      setWidth(window.innerWidth);
    }, 250);
    window.addEventListener('resize', debounced);
    return () => window.removeEventListener('resize', debounced);
  }, []);
  return <Window.Provider value={{ width }}>{children}</Window.Provider>;
};

WindowProvider.propTypes = {
  children: node.isRequired,
};

export default WindowProvider;
