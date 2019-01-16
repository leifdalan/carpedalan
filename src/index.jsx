import React, { createContext, useState } from 'react';
import { oneOf, string } from 'prop-types';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import request from 'superagent';

import Admin from './pages/Admin';
import Login from './pages/Login';
import Slash from './pages/Slash';
import Tag from './pages/Tag';
import Archive from './pages/Archive';
import { themes, GlobalStyleComponent } from './styles';
import TagProvider from './providers/TagProvider';
import TagsPostProvider from './providers/TagPostsProvider';
import PostProvider from './providers/PostsProvider';
import WindowProvider from './providers/WindowProvider';
import Sidebar from './components/Sidebar';
import Menu from './styles/Menu';

export const Router = createContext({});

export const User = createContext({
  counter: 0,
  data: [],
  isLoading: false,
});

function Root({ user, defaultTheme }) {
  const [userState, setUser] = useState(user);
  const [theme, setTheme] = useState(defaultTheme);
  const [shouldShowSidebar, setShouldShowSidebar] = useState(false);

  const handleChangeTheme = async () => {
    const newTheme = theme === 'dark' ? 'lite' : 'dark';
    if (theme === 'dark') setTheme('lite');
    else setTheme('dark');
    await request.post('/api/user', {
      defaultTheme: newTheme,
    });
  };

  const toggleMenu = () => setShouldShowSidebar(!shouldShowSidebar);

  return (
    <WindowProvider>
      <User.Provider value={{ user: userState, setUser }}>
        <TagProvider>
          <PostProvider>
            <TagsPostProvider>
              <ThemeProvider theme={themes[theme]}>
                <>
                  <BrowserRouter>
                    <>
                      {!shouldShowSidebar && userState ? (
                        <Menu
                          data-test="menu"
                          size="small"
                          onClick={toggleMenu}
                          type="button"
                        >
                          Menu
                        </Menu>
                      ) : null}
                      <Sidebar
                        isOpen={shouldShowSidebar}
                        userState={userState}
                        setUser={setUser}
                        handleChangeTheme={handleChangeTheme}
                        toggleMenu={toggleMenu}
                      />
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
                  </BrowserRouter>
                  <GlobalStyleComponent />
                </>
              </ThemeProvider>
            </TagsPostProvider>
          </PostProvider>
        </TagProvider>
      </User.Provider>
    </WindowProvider>
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
