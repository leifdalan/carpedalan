FROM cypress/base:10
WORKDIR /cy
COPY yarn.lock .
COPY package.json .
RUN yarn
COPY cypress.json .

