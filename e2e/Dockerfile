FROM buildkite/puppeteer:latest AS base
WORKDIR /e2e
COPY e2e/yarn.lock .
COPY e2e/package.json .
RUN yarn
COPY e2e/src ./src
COPY e2e/jest.config.js .
