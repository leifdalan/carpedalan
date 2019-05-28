import { DataProvider } from 'providers/Data';
import { UserProvider } from 'providers/User';
import * as React from 'react';
import { BrowserRouter, Link, Redirect, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyleComponent, themes } from 'styles/utils';

import Routes from './Routes';
import { User } from './User';

const App: React.FC<{ user: User }> = ({ user }) => {
  return (
    <UserProvider>
      <DataProvider>
        <BrowserRouter>
          <ThemeProvider theme={themes.lite}>
            <>
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
