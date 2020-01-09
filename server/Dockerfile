FROM node:12-alpine AS base
WORKDIR /app
COPY yarn.lock .

COPY server/package.json .
RUN apk add curl git
RUN yarn --production --ignore-optional
COPY server/ ./server
COPY shared/ ./shared
COPY .env.example .
COPY index.js . 
COPY scripts/ ./scripts
COPY db/ ./db
EXPOSE 3001
RUN apk add postgresql

FROM base AS dev
RUN yarn --ignore-optional
COPY server/nodemon.json .
# COPY webpack.prod.js .
# RUN NODE_ENV=production yarn build
EXPOSE 9229


FROM base as prod
RUN mkdir /app/client
COPY client/yarn.lock ./client
COPY client/package.json ./client
RUN cd /app/client && yarn --production
COPY client/src ./client/src
COPY client/tsconfig.json ./client
COPY client/webpack.config.prod.js ./client
COPY client/babel.config.js ./client
COPY client/devServer.js ./client
RUN cd /app/client && yarn build:prod

COPY .env .

ARG CRICLE_SHA1
ARG CIRCLE_BUILD_NUM
ARG CIRCLE_BRANCH
ENV CIRCLE_SHA1=$CIRCLE_SHA1
ENV CIRCLE_BUILD_NUM=$CIRCLE_BUILD_NUM
ENV CIRCLE_BRANCH=$CIRCLE_BRANCH
ENV NODE_ENV=production

CMD ["yarn", "start:prod"]



