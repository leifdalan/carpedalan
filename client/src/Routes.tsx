import axios from 'axios';
import useUser from 'hooks/useUser';
import Login from 'pages/Login';
import Request from 'pages/Request';
import { UserContext } from 'providers/User';
import * as React from 'react';
import { Link, Redirect, Route, Switch } from 'react-router-dom';

const RedirectToLogin = () => <Redirect to="/" />;

const { lazy, Suspense } = React;

const LazySlash = lazy(() =>
  import(/* webpackChunkName: "loggedin" */ 'pages/Slash'),
);

const Spinner = () => <div>Spinner</div>;

const { useState, useContext } = React;
const Routes: React.FC = () => {
  const { setUser, user: globalUser } = useUser();

  async function logout() {
    await axios.post('/v1/logout');
    setUser(undefined);
  }

  return (
    <Suspense fallback={<Spinner />}>
      <Link to="login">Login</Link>
      <Link to="/">Slash</Link>
      <Link to="/test">test page</Link>
      <div onClick={logout}>logout</div>
      <Switch>
        <Route exact={true} path="/request" component={Request} />

        {globalUser ? (
          <Route exact={true} path="/" component={LazySlash} />
        ) : (
          <Route exact={true} path="/" component={Login} />
        )}
        <Route component={RedirectToLogin} />
      </Switch>
    </Suspense>
  );
};

export default Routes;
