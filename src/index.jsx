import React, { createContext, useState } from 'react';
import { oneOf, string } from 'prop-types';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
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
import Title from './styles/Title';

const Menu = styled(Title)`
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  cursor: pointer;
  outline: inherit;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 25px;
  background: white;
  padding: 5px;
  box-shadow: rgba(255, 255, 255) 0px 0px 10px 10px;
  border-radius: 40%;
  margin-top: 1em;
`;

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
                  <Router>
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
                  </Router>
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
