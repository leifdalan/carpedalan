import debug from 'debug';
import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

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

const Routes: React.FC = () => {
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
      <Switch>
        <Route exact path="/request" component={Request} />
        {globalUser ? (
          <Route
            path="/tag/:tagName"
            render={props => <LazyTag {...props} />}
          />
        ) : null}

        {globalUser ? (
          <Route path="/" component={LazySlash} />
        ) : (
          <Route exact path="/" component={Login} />
        )}
        <Route component={RedirectToLogin} />
      </Switch>
    </Suspense>
  );
};

export default Routes;
