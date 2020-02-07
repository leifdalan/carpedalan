FROM node:12-slim AS base
WORKDIR /app
COPY yarn.lock .
COPY package.json .
RUN yarn
COPY src ./src
COPY tsconfig.json .
COPY webpack.config.js .
COPY webpack.config.prod.js .
COPY babel.config.js .
COPY devServer.js .
EXPOSE 4000

CMD ["node", "devServer"]
