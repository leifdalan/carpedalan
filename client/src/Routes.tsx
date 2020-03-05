import debug from 'debug';
import * as React from 'react';
import { Redirect, Route, Routes } from 'react-router-dom';

import SidebarAndMenu from 'components/SidebarAndMenu';
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

const AppRoutes: React.FC = () => {
  const { fetchTags } = useTags();
  const { user: globalUser } = useUser();
  useEffect(() => {
    log('route is mounting');
    if (globalUser) {
      fetchTags();
    }
  }, [fetchTags, globalUser]);

  return (
    <Suspense fallback={<Spinner />}>
      <SidebarAndMenu />
      <Routes>
        <Route exact path="/request" element={<Request />} />
        {globalUser ? (
          <Route path="/tag/:tagName" element={<LazyTag />} />
        ) : null}

        {globalUser ? (
          <Route path="/*" element={<LazySlash />} />
        ) : (
          <Route path="/" element={<Login />} />
        )}
        <Route path="*" element={<RedirectToLogin />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
