import { hot, setConfig } from 'react-hot-loader';

import App from '.';

setConfig({ pureSFC: true });
export default hot(module)(App);
