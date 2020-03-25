#!/bin/bash
set -e
echo 'Building client...'
docker build -t client:latest -f client/Dockerfile --cache-from client:latest --cache-from node:12-slim .
echo 'Running prod build for client...'
docker run -v "$PWD/dist":/app/client/dist -e "ASSET_CDN_DOMAIN=cdn.$(pulumi config get domain)" -e "DEFAULT_POSTS_PER_PAGE=50" client:latest yarn build:prod
echo 'Building API...'
docker build -t api:latest -f server/Dockerfile --cache-from api:latest --cache-from node:12-alpine . --target=dev
echo 'Building lambda layer...'
cd imageResizer/layer/nodejs && yarn build && cd ..
echo 'Zipping up layer folder...'
rm -f layer.zip
zip -r -X layer.zip ./*
pwd
cd ../..
yarn
echo 'Removing imageResizer/src/node_modules for lambda layer deployment...'
rm -rf imageResizer/src/node_modules
echo 'Running pulumi up.'
CI_JOB_ID=$(git log -1 --pretty=%B) CI_COMMIT_SHA=$(git rev-parse HEAD) CI_COMMIT_REF_NAME=$(git rev-parse --abbrev-ref HEAD) pulumi up "$@"
notif "Pulumi deployed!"