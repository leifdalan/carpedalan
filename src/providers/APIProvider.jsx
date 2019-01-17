import React, { createContext, useState } from 'react';
import { node } from 'prop-types';
import styled from 'styled-components';
import request from 'superagent';

import { getThemeValue, DANGER_COLOR } from '../styles';

export const API = createContext({
  request: () => {},
  retry: () => {},
});

class APIError extends Error {}

const Toast = styled.div`
  position: fixed;
  bottom: 1em;
  width: 95vw;
  margin-left: 2.5vw;
  padding: 2em;
  background-color: ${getThemeValue(DANGER_COLOR)};
`;

export default function APIProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const patch = (...args) => {
    setLoading(true);
    const req = request.patch(...args);
    setLoading(false);
    return req;
  };
  const get = async (...args) => {
    let req;
    try {
      setLoading(true);
      req = await request.get(...args);
      if (!req.body) throw new APIError('shit!');
    } catch (e) {
      setError('Get failed');
    } finally {
      setLoading(false);
    }
    return req;
  };

  const post = (...args) => {
    setLoading(true);
    const req = request.post(...args);
    setLoading(false);
    return req;
  };
  const del = (...args) => {
    setLoading(true);
    const req = request.del(...args);
    setLoading(false);
    return req;
  };

  return (
    <API.Provider value={{ patch, get, post, del, loading }}>
      {children}
      {error ? <Toast>{error}</Toast> : null}
    </API.Provider>
  );
}

APIProvider.propTypes = {
  children: node.isRequired,
};
