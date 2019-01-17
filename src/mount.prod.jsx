import 'babel-polyfill';
import React from 'react';
import DOM from 'react-dom';

import App from '.';

/* eslint-disable no-underscore-dangle */
DOM.render(
  <App {...window.__SESSION__} {...window.__META__} />,
  document.getElementById('root'),
);
