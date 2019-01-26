import 'babel-polyfill';
import React from 'react';
import DOM from 'react-dom';

import App from './hotEntry';
import { window } from './utils/globals';
/* eslint-disable */
// eslint-disable-next-line no-underscore-dangle
DOM.render(<App {...window.__SESSION__} {...window.__META__}  />, document.getElementById('root'));
if ('serviceWorker' in navigator) {
  console.log('CLIENT: service worker registration in progress.');
  navigator.serviceWorker.register('/sw.js').then(function() {
    console.log('CLIENT: service worker registration complete.');
  }, function() {
    console.log('CLIENT: service worker registration failure.');
  });
} else {
  console.log('CLIENT: service worker is not supported.');
}
