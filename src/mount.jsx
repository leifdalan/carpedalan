import 'babel-polyfill';
import React from 'react';
import DOM from 'react-dom';

import App from './hotEntry';
import { window } from './utils/globals';
/* eslint-disable */
// eslint-disable-next-line no-underscore-dangle
const isCi = window.__META__.ci; // eslint-disable-line

DOM.render(<App {...window.__SESSION__} {...window.__META__} api={window.__API__} />, document.getElementById('root'));

// if (!isCi) {
//   navigator.serviceWorker.getRegistrations().then(

//     function(registrations) {

//         for(let registration of registrations) {  
//             registration.unregister();

//         }

// });
// }
