import React, { createContext, useEffect, useState } from 'react';
import { node, shape } from 'prop-types';
import debounce from 'lodash/debounce';
import { withRouter } from 'react-router-dom';

import { window } from '../utils/globals';

export const Window = createContext({});
const WindowProvider = ({ children, match, location, history }) => {
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);

  useEffect(() => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
    const debounced = debounce(() => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    }, 250);
    window.addEventListener('resize', debounced);
    return () => window.removeEventListener('resize', debounced);
  }, []);
  return (
    <Window.Provider value={{ width, match, location, history, height }}>
      {children}
    </Window.Provider>
  );
};

WindowProvider.propTypes = {
  children: node.isRequired,
  match: shape({}).isRequired,
  history: shape({}).isRequired,
  location: shape({}).isRequired,
};

export default withRouter(WindowProvider);
