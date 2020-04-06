import debug from 'debug';
import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { client as api } from 'ApiClient';
import Routes from 'Routes';
import { User } from 'User';
import withErrorBoundary from 'components/ErrorBoundary';
import useUser from 'hooks/useUser';
import { GlobalStyleComponent, themes } from 'styles/utils';

const log = debug('App');

const refreshCookie = async () => {
  log('Refreshing cookiaxdae');
  await api.refresh();
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
      }, 1000 * 29);
      return () => clearInterval(interval);
    }
    return () => {};
  }, [userState]);

  return (
    <BrowserRouter>
      <ThemeProvider theme={themes.lite}>
        <>
          <Routes />
          <GlobalStyleComponent />
        </>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default withErrorBoundary({ Component: App, namespace: 'App Level' });
