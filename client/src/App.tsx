import axios from 'axios';
import debug from 'debug';
import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import Routes from 'Routes';
import { User } from 'User';
import useUser from 'hooks/useUser';
import { DataProvider } from 'providers/Data';
import { GlobalStyleComponent, themes } from 'styles/utils';

const log = debug('App');

const refreshCookie = async () => {
  log('Refreshing cookiaxdae');
  await axios.post('/v1/refresh');
};

const { useEffect } = React;
const App: React.FC<{ user: User }> = () => {
  const { user: userState } = useUser();

  /**
   * Cloudfront cookie needs to be refreshed every 30s for
   * the images to not 403. This effect well set the cookie at
   * that interval if the user has been authenticated.
   */
  useEffect(() => {
    if (userState) {
      const interval = setInterval(() => {
        refreshCookie();
      }, 1000 * 31);
      return () => clearInterval(interval);
    }
    return () => {};
  }, [userState]);

  return (
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
  );
};

export default App;
