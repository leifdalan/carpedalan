FROM node:10-alpine AS base
WORKDIR /app
COPY yarn.lock .

COPY package.json .
RUN apk add curl=7.64.0-r1 git=2.20.1-r0
RUN yarn --production --ignore-optional
COPY src/ ./src
COPY server/ ./server
COPY api/ ./api
COPY public/ ./public
COPY api-v1/ ./api-v1
COPY shared/ ./shared
COPY babel.config.js .
COPY .env.example .
COPY index.js . 
COPY scripts/ ./scripts
COPY db/ ./db
EXPOSE 3001

FROM base as prod
COPY .env .
ENV NODE_ENV=production
COPY webpack.prod.js .
RUN yarn build
EXPOSE 80
EXPOSE 514
EXPOSE 6514


CMD ["yarn", "start:prod"]


FROM base AS dev
RUN yarn --ignore-optional
COPY .env .
COPY nodemon.json .
# COPY webpack.prod.js .
# RUN NODE_ENV=production yarn build
COPY webpack.config.js .
EXPOSE 9229

# FROM gcr.io/distroless/nodejs as small
# COPY --from=prod /app /
# ENV NODE_ENV=production
# EXPOSE 80
# EXPOSE 514
# EXPOSE 6514


# CMD ["index.js"]