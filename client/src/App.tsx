import Menu from 'components/Menu';
import Sidebar from 'components/Sidebar';
import useUser from 'hooks/useUser';
import { DataProvider } from 'providers/Data';
import { UserProvider } from 'providers/User';
import * as React from 'react';
import { BrowserRouter, Link, Redirect, Route, Switch } from 'react-router-dom';
import Routes from 'Routes';
import { ThemeProvider } from 'styled-components';
import { GlobalStyleComponent, themes } from 'styles/utils';
import { User } from 'User';

const { useState } = React;
const App: React.FC<{ user: User }> = () => {
  const { user: userState, setUser } = useUser();
  const [shouldShowSidebar, setShouldShowSidebar] = useState(false);

  const isLoggedIn = !!userState;

  const toggleMenu = () => setShouldShowSidebar(!shouldShowSidebar);

  return (
    <UserProvider>
      <DataProvider>
        <BrowserRouter>
          <ThemeProvider theme={themes.lite}>
            <>
              <Menu
                data-test="menu"
                size="small"
                // @ts-ignore wtf
                onClick={toggleMenu}
                type="button"
              >
                Menu
              </Menu>
              <Sidebar
                isOpen={shouldShowSidebar}
                userState={userState}
                toggleMenu={toggleMenu}
              />
              <Routes />
              <GlobalStyleComponent />
            </>
          </ThemeProvider>
        </BrowserRouter>
      </DataProvider>
    </UserProvider>
  );
};

export default App;
