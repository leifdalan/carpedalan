#!/bin/bash
echo 'Removing dist...'
rm -rf dist
echo 'Removing client/dist...'
rm -rf client/dist
echo 'Building client as client:latest...'
docker build -t client:latest -f client/Dockerfile .
echo 'Building api as api:latest...'
docker build -t api:latest -f server/Dockerfile . --target=dev
echo 'Building cypress as registry.gitlab.com/carpedalan/carpedalan-web/cypress:latest...'
docker build -t registry.gitlab.com/carpedalan/carpedalan-web/cypress:latest -f cypress/Dockerfile ./cypress
echo 'Running prod build of client assets for ./dist/...'
docker run -v "$PWD/dist":/app/client/dist -e "ASSET_CDN_DOMAIN=cdn.carpe.dalan.dev" client:latest yarn build:prod