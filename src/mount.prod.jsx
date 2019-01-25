import 'babel-polyfill';
import React from 'react';
import DOM from 'react-dom';
import LogRocket from 'logrocket';

import App from '.';

LogRocket.init('ovx5ph/carpe-dalan');

/* eslint-disable no-underscore-dangle */
DOM.render(
  <App {...window.__SESSION__} {...window.__META__} />,
  document.getElementById('root'),
);
