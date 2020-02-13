import * as React from 'react';
import * as ReactDOM from 'react-dom';

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
    };
    __PUBLIC_PATH__: string;
  }
}

// Dynamically set the public path so that we can re-use assets.
__webpack_public_path__ = window.__PUBLIC_PATH__;
// Doing this so that theres a trace on Chrome Debugger since
// we are using the debug module (you lose line numbers)
ReactDOM.render(
  <App {...window.__SESSION__} />,
  document.getElementById('root'),
);
