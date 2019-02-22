import fs from 'fs';
import path from 'path';

const VALID_METHODS = ['delete', 'get', 'patch', 'post', 'put'];

/* eslint-disable no-restricted-syntax */
const discoverRoutes = (dir, urlPath) => {
  urlPath = urlPath || dir;
  let routes = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);

    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      // Rewrite _id to :id
      const urlDir = file;

      const subRoutes = discoverRoutes(
        path.join(dir, file),
        path.join(urlPath, urlDir),
      );
      routes = [...routes, ...subRoutes];
    } else {
      const parsedPath = path.parse(file);
      console.error('parsedPath', parsedPath);

      const methodIndex = VALID_METHODS.indexOf(parsedPath.name);

      if (methodIndex === -1) {
        continue;
      }

      routes = [
        ...routes,
        {
          path: `${urlPath.replace(/\\/g, '/')}`,
          module: require(`../${filePath}`).default,
        },
      ];
    }
  }

  return routes;
};

export default discoverRoutes;
