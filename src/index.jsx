import React, { createContext, useState } from 'react';
import { bool, oneOfType, string } from 'prop-types';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import Admin from './admin';
import Login from './pages/Login';

export const User = createContext({
  counter: 0,
  setCounter: () => {},
  data: [],
  isLoading: false,
});

function Root({ user }) {
  const [userState, setUser] = useState(user);
  const [counter, setCounter] = useState(0);

  return (
    <User.Provider value={{ user: userState, setUser }}>
      <Router>
        <>
          <div onClick={() => setCounter(counter + 1)}> click me</div>
          <Link to="/login">asdfff</Link>
          {userState === 'write' ? <Link to="/admin">admin</Link> : null}
          <div>{userState}</div>
          <Switch>
            <Route exact path="/login" component={Login} />

            {userState === 'write' ? (
              <Route exact path="/admin" component={Admin} />
            ) : null}
            <Route render={() => 'no match'} />
          </Switch>
        </>
      </Router>
    </User.Provider>
  );
}

Root.propTypes = {
  user: oneOfType([string, bool]).isRequired,
};

export default Root;
