import debug from 'debug';
import * as React from 'react';
import { Redirect, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';

import withErrorBoundary from 'components/ErrorBoundary';
import SidebarAndMenu from 'components/SidebarAndMenu';
import Toaster from 'components/Toaster';
import useGlobalSwipe from 'hooks/useGlobalSwipe';
import useTags from 'hooks/useTags';
import useUser from 'hooks/useUser';
import Login from 'pages/Login';
import Request from 'pages/Request';

const log = debug('components:Routes');

const RedirectToLogin = () => <Redirect to="/" />;

const { lazy, Suspense, useEffect } = React;

const LazySlash = lazy(() =>
  import(/* webpackChunkName: "loggedin" */ 'pages/Slash'),
);
const LazyTag = lazy(() => import(/* webpackChunkName: "tag" */ 'pages/Tag'));

const Spinner = () => <div>12341234i1234124oij</div>;

const AppWrapper = styled.div`
  height: 100%;
  width: 100%;
`;

const AppRoutes: React.FC = () => {
  const { fetchTags } = useTags();
  const { user: globalUser } = useUser();
  const { handlers } = useGlobalSwipe();
  useEffect(() => {
    log('route is mounting');
    if (globalUser) {
      fetchTags();
    }
  }, [fetchTags, globalUser]);

  return (
    <AppWrapper {...handlers}>
      <Suspense fallback={<Spinner />}>
        <Toaster />
        <SidebarAndMenu />
        <Routes>
          <Route exact path="/request" element={<Request />} />
          {globalUser ? (
            <Route path="/tag/:tagName/*" element={<LazyTag />} />
          ) : null}

          {globalUser ? (
            <Route path="/*" element={<LazySlash />} />
          ) : (
            <Route path="/*" element={<Login />} />
          )}
          <Route path="*" element={<RedirectToLogin />} />
        </Routes>
      </Suspense>
    </AppWrapper>
  );
};

export default withErrorBoundary({ Component: AppRoutes, namespace: 'Routes' });
