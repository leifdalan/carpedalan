import debug from 'debug';
import * as React from 'react';
import { Redirect, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';

import withErrorBoundary from 'components/ErrorBoundary';
import SidebarAndMenu from 'components/SidebarAndMenu';
import Toaster from 'components/Toaster';
import useUser from 'hooks/useUser';
import Login from 'pages/Login';
import Request from 'pages/Request';
import Slash from 'pages/Slash';
import Tag from 'pages/Tag';

const log = debug('components:Routes');

const RedirectToLogin = () => <Redirect to="/" />;

const { Suspense } = React;

const Spinner = () => <div>12341234i1234124oij</div>;

const AppWrapper = styled.div`
  height: 100%;
  width: 100%;
`;

const AppRoutes: React.FC = () => {
  const { user: globalUser } = useUser();
  return (
    <AppWrapper>
      <Suspense fallback={<Spinner />}>
        <Toaster />
        <SidebarAndMenu />
        <Routes>
          <Route exact path="/request" element={<Request />} />
          {globalUser ? (
            <Route path="/tag/:tagName/*" element={<Tag />} />
          ) : null}

          {globalUser ? (
            <Route path="/*" element={<Slash />} />
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
