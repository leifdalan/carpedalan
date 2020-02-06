FROM node:12-alpine AS base
WORKDIR /app
COPY server/yarn.lock .

COPY server/package.json .
RUN yarn --production --ignore-optional
RUN apk add postgresql git
COPY server/ ./server
COPY shared/ ./shared
COPY .env.example .
COPY index.js . 
COPY scripts/ ./scripts
COPY db/ ./db
EXPOSE 3001



FROM base AS dev
RUN yarn --ignore-optional
COPY server/nodemon.json .
EXPOSE 9229


# FROM node:12-alpine as client-build
# WORKDIR /client
# COPY client/yarn.lock .
# COPY client/package.json .
# RUN yarn
# COPY client/src ./src
# COPY client/tsconfig.json .
# COPY client/webpack.config.prod.js .
# ENV PROD_BUILD=true
# RUN ls -al
# RUN yarn build:prod

FROM base as prod
# COPY --from=client-build /client/dist/ /app/server/dist
COPY ./dist server/dist

ARG CIRCLE_SHA1
ARG CIRCLE_BUILD_NUM
ARG CIRCLE_BRANCH
ENV CIRCLE_SHA1=$CIRCLE_SHA1
ENV CIRCLE_BUILD_NUM=$CIRCLE_BUILD_NUM
ENV CIRCLE_BRANCH=$CIRCLE_BRANCH
ENV NODE_ENV=production

CMD ["yarn", "start:prod"]



