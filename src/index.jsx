import React, { createContext, useState } from 'react';
import { bool, oneOfType, string, oneOf } from 'prop-types';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import request from 'superagent';

import Admin from './pages/Admin';
import Login from './pages/Login';
import Slash from './pages/Slash';
import Tag from './pages/Tag';
import Archive from './pages/Archive';
import LogoutButton from './components/LogoutButton';
import { themes, GlobalStyleComponent } from './styles';
import TagProvider from './providers/TagProvider';
import TagsPostProvider from './providers/TagPostsProvider';
import PostProvider from './providers/PostsProvider';

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
      <TagProvider>
        <PostProvider>
          <TagsPostProvider>
            <ThemeProvider theme={themes[theme]}>
              <>
                <Router>
                  <>
                    {userState ? (
                      <>
                        <button type="button" onClick={handleChangeTheme}>
                          toggle themeaa
                        </button>
                        <LogoutButton setUser={setUser} />
                        <Link to="/login">login</Link>
                        <Link to="/">slash</Link>
                        <Link to="/archive">archive</Link>
                        {userState === 'write' ? (
                          <Link to="/admin">admin</Link>
                        ) : null}
                        <div>{userState}</div>
                      </>
                    ) : null}
                    <Switch>
                      <Route exact path="/" component={Slash} />
                      <Route exact path="/login" component={Login} />
                      <Route exact path="/archive" component={Archive} />
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
          </TagsPostProvider>
        </PostProvider>
      </TagProvider>
    </User.Provider>
  );
}

Root.defaultProps = {
  defaultTheme: 'lite',
  user: undefined,
};

Root.propTypes = {
  user: string,
  defaultTheme: oneOf(Object.keys(themes)),
};

export default Root;
