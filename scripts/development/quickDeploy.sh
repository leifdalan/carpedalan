#!/bin/bash
set -e
echo 'Building client...'
rm -rf client/dist
rm -rf dist
rm -rf imageResizer/src/node_modules
docker build -t client:latest -f client/Dockerfile --cache-from client:latest --cache-from node:12-slim .
echo 'Running prod build for client...'
docker run -v "$PWD/dist":/app/client/dist -e "ASSET_CDN_DOMAIN=cdn.$(pulumi config get domain)" -e "DOMAIN=$(pulumi config get domain)" -e "DEFAULT_POSTS_PER_PAGE=200" client:latest yarn build:prod
echo 'Building API...'
docker build -t api:latest -f server/Dockerfile --cache-from api:latest --cache-from node:12-alpine . --target=dev
echo 'Running pulumi up.'
export CI_JOB_ID=$(git log -1 --pretty=%B)
echo $CI_JOB_ID
CI_JOB_ID=$(git log -1 --pretty=%B) CI_COMMIT_SHA=$(git rev-parse HEAD) CI_COMMIT_REF_NAME=$(git rev-parse --abbrev-ref HEAD) pulumi up "$@"