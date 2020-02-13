#!/bin/bash
set -e
docker build -t client:latest -f client/Dockerfile --cache-from client:latest --cache-from node:12-slim .
docker run -v "$PWD/dist":/app/dist -e "ASSET_CDN_DOMAIN=cdn.carpe.dalan.dev" client:latest yarn build:prod
docker build -t api:latest -f server/Dockerfile --cache-from api:latest --cache-from node:12-alpine . --target=dev
cd imageResizer/layer/nodejs && yarn build && cd ../../..
yarn
CI_JOB_ID=$(git log -1 --pretty=%B) CI_COMMIT_SHA=$(git rev-parse HEAD) CI_COMMIT_REF_NAME=$(git rev-parse --abbrev-ref HEAD) pulumi up