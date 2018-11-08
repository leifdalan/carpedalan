import api from './api/router';

export default app => {
  app.use('/api', api);
};
