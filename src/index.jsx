import React, { createContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import request from 'superagent';
import { MemoryRouter as Router, Route, Link } from 'react-router-dom';
import { hot, setConfig } from 'react-hot-loader';

import About from './about';
import Admin from './admin';

setConfig({ pureSFC: true });
const Div = styled.div`
  font-size: 45px;
`;

export const Counter = createContext({
  counter: 0,
  setCounter: () => {},
  data: [],
  isLoading: false,
});
const { Provider } = Counter;

function Root() {
  const [counter, setCounter] = useState(0);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  useEffect(
    async () => {
      setLoading(true);
      const response = await request(
        'https://api.github.com/users/leifdalan/repos?type=all&sort=updated',
      );
      const responseData = await response.body;
      setData(responseData);
      setLoading(false);
    },
    [counter],
  );

  return (
    <Provider value={{ counter, setCounter, data, isLoading }}>
      <Router>
        <>
          <Div data-test="clicky" onClick={() => setCounter(counter + 1)}>
            addfffwww
            {counter}
            <Link to="/about">About</Link>
            <Link to="/admin">Admin</Link>
          </Div>
          <Route
            exact
            path="/about"
            render={props => (
              <About {...props} counter={counter} setCounter={setCounter} />
            )}
          />
          <Route
            exact
            path="/admin"
            render={props => (
              <Admin {...props} counter={counter} setCounter={setCounter} />
            )}
          />
        </>
      </Router>
    </Provider>
  );
}

export default hot(module)(Root);
