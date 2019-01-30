import 'babel-polyfill';
import React from 'react';
import DOM from 'react-dom';

import App from './hotEntry';
import { window } from './utils/globals';
/* eslint-disable */
// eslint-disable-next-line no-underscore-dangle
const isCi = window.__META__.ci; // eslint-disable-line

DOM.render(<App {...window.__SESSION__} {...window.__META__}  />, document.getElementById('root'));

if (!isCi) {
  if ('serviceWorker' in navigator) {
    console.log('CLIENT: service worker registration in progress.');
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      registration.unregister();
      console.log('CLIENT: service worker registration complete.');
    }, function() {
      console.log('CLIENT: service worker registration failure.');
    });
  } else {
    console.log('CLIENT: service worker is not supported.');
  }
}
