import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { PrecacheEntry } from 'workbox-precaching/_types';

import { GetTagsResponseBodyI } from 'ApiClient';

import App from './App';
import { User } from './User';

// export default function App() {
//   return <div>hello</div>
// }
/* eslint-disable */
// eslint-disable-next-line no-underscore-dangle

declare global {
  interface Window {
    __SESSION__: {
      user: User;
      requests: number;
    };
    __META__: {
      cdn: string;
      posts: {
        count: number;
        averageRatio: number;
        frequencyByMonth: {
          [index: number]: number
        };
        firstTimestamp: number;
        lastTimestamp: number;
      }
      tags: GetTagsResponseBodyI;
    };
    __PUBLIC_PATH__: string;
    __WB_MANIFEST: PrecacheEntry[];
    registration: any;

  }
}

// Dynamically set the public path so that we can re-use assets.
__webpack_public_path__ = window.__PUBLIC_PATH__;
// Doing this so that theres a trace on Chrome Debugger since
// we are using the debug module (you lose line numbers)

console.log('CLIENT: service worker registrat ion in progress.');
navigator.serviceWorker.register('/sw.js').then(
  () => {
    // registration.unregister();
    console.log('CLIENT: service worker registration complete.');
  },
  () => {
    console.log('CLIENT: service worker registration failure.');
  },
);



ReactDOM.render(
  <App {...window.__SESSION__} />,
  document.getElementById('root'),
);
