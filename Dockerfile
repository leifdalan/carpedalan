FROM node:12-alpine AS base
WORKDIR /app
COPY yarn.lock .

COPY package.json .
RUN apk add curl git
RUN yarn --production --ignore-optional
COPY server/ ./server
COPY shared/ ./shared
COPY .env.example .
COPY index.js . 
COPY scripts/ ./scripts
COPY db/ ./db
EXPOSE 3001

FROM base AS dev
RUN apk add postgresql
RUN yarn --ignore-optional
COPY .env .
COPY nodemon.json .
# COPY webpack.prod.js .
# RUN NODE_ENV=production yarn build
COPY webpack.config.js .
EXPOSE 9229

FROM base as prod

COPY .env .
COPY --from=client /client/dist/ /app/server/dist/

ARG CRICLE_SHA1
ARG CIRCLE_BUILD_NUM
ARG CIRCLE_BRANCH
ENV CIRCLE_SHA1=$CIRCLE_SHA1
ENV CIRCLE_BUILD_NUM=$CIRCLE_BUILD_NUM
ENV CIRCLE_BRANCH=$CIRCLE_BRANCH
ENV NODE_ENV=production

CMD ["yarn", "start:prod"]



