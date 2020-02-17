FROM node:12-slim AS base
WORKDIR /app/client
COPY client/yarn.lock .
COPY client/package.json .
RUN yarn
COPY client/src ./src
COPY client/tsconfig.json .
COPY client/webpack.config.js .
COPY client/webpack.config.dll.js .
RUN yarn webpack --config webpack.config.dll.js
COPY client/webpack.config.prod.js .
COPY client/babel.config.js .
COPY client/devServer.js .
COPY client/.eslintrc.js .
COPY ./.eslint-ts-base.js /app/
CMD ["node", "devServer"]
