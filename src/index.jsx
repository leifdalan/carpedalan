import React, { createContext, useState } from 'react';
import { bool, oneOfType, string, oneOf } from 'prop-types';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import request from 'superagent';

import Admin from './pages/Admin';
import Login from './pages/Login';
import Slash from './pages/Slash';
import Tag from './pages/Tag';
import LogoutButton from './components/LogoutButton';
import { themes, GlobalStyleComponent } from './styles';

export const User = createContext({
  counter: 0,
  setCounter: () => {},
  data: [],
  isLoading: false,
});

function Root({ user, defaultTheme }) {
  const [userState, setUser] = useState(user);
  const [theme, setTheme] = useState(defaultTheme);

  const handleChangeTheme = async () => {
    const newTheme = theme === 'dark' ? 'lite' : 'dark';
    if (theme === 'dark') setTheme('lite');
    else setTheme('dark');
    await request.post('/api/user', {
      defaultTheme: newTheme,
    });
  };

  return (
    <User.Provider value={{ user: userState, setUser }}>
      <ThemeProvider theme={themes[theme]}>
        <>
          <Router>
            <>
              <button type="button" onClick={handleChangeTheme}>
                toggle themeaa
              </button>
              {userState ? <LogoutButton setUser={setUser} /> : null}
              <Link to="/login">login gzip</Link>
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

          <GlobalStyleComponent />
        </>
      </ThemeProvider>
    </User.Provider>
  );
}

Root.defaultProps = {
  defaultTheme: 'lite',
};

Root.propTypes = {
  user: oneOfType([string, bool]).isRequired,
  defaultTheme: oneOf(Object.keys(themes)),
};

export default Root;
