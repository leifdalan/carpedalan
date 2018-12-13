import 'babel-polyfill';
import React from 'react';
import DOM from 'react-dom';

import App from '.';

// eslint-disable-next-line no-underscore-dangle
DOM.render(<App user={window.__SESSION__} />, document.getElementById('root'));
