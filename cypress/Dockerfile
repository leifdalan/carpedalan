FROM cypress/base:10
WORKDIR /app
RUN yarn add cypress@3.1.3
RUN yarn add dotenv-safe
RUN yarn add aws-sdk
RUN yarn add knex
COPY cypress.json .

