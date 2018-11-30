FROM node:10-alpine
EXPOSE 3001
EXPOSE 9229
WORKDIR /app
COPY yarn.lock .
COPY package.json .
RUN npm install
COPY src/ ./src
COPY server/ ./server
COPY api/ ./api
COPY shared/ ./shared
COPY babel.config.js .
COPY webpack.config.js .
COPY webpack.prod.js .
COPY .env .
COPY .env.example .
COPY nodemon.json .
COPY goodDataWithEtagAndKey.json .
COPY index.js . 

