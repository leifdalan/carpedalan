import React, { createContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import request from 'superagent';
import { MemoryRouter as Router, Route, Link } from 'react-router-dom';

import Login from './pages/Login';

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
          <Link to="/login">Login</Link>
          <Route exact path="/login" component={Login} />
        </>
      </Router>
    </Provider>
  );
}

export default Root;
