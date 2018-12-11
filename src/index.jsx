import React, { createContext, useState } from 'react';
import { bool, oneOfType, string } from 'prop-types';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import Admin from './admin';
import Login from './pages/Login';
import Slash from './pages/Slash';
import Tag from './pages/Tag';

export const User = createContext({
  counter: 0,
  setCounter: () => {},
  data: [],
  isLoading: false,
});

function Root({ user }) {
  const [userState, setUser] = useState(user);

  return (
    <User.Provider value={{ user: userState, setUser }}>
      <Router>
        <>
          <Link to="/login">login</Link>
          <Link to="/">slash</Link>
          {userState === 'write' ? <Link to="/admin">admin</Link> : null}
          <div>{userState}</div>
          <Switch>
            <Route exact path="/" component={Slash} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/tag/:tag" component={Tag} />
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
