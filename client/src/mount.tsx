import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { PrecacheEntry } from 'workbox-precaching/_types';

import { GetTagsResponseBodyI } from 'ApiClient';

import { User } from './User';
import hotEntry from './hotEntry';

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
    __WB_MANIFEST: PrecacheEntry[];
    registration: any;
  }
}
// Doing this so that theres a trace on Chrome Debugger since
// we are using the debug module (you lose line numbers)
console.log = console.warn;
const App = hotEntry;

console.log('CLIENT: service worker registration in progress.');
navigator.serviceWorker.register('/dist/sw.js', { scope: '/' }).then(
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
