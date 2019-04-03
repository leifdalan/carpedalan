FROM cypress/base:10
WORKDIR /app
RUN yarn add cypress@3.2.0
RUN yarn add dotenv-safe
RUN yarn add aws-sdk
RUN yarn add knex
RUN yarn add pg
RUN yarn add cypress-dark
COPY cypress.json .

