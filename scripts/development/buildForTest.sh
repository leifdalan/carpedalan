#!/bin/bash
docker build -t client:latest -f client/Dockerfile .
docker build -t api:latest -f server/Dockerfile . --target=dev
docker build -t registry.gitlab.com/carpedalan/carpedalan-web/cypress:latest -f cypress/Dockerfile ./cypress
docker run -v "$PWD/dist":/app/client/dist -e "ASSET_CDN_DOMAIN=cdn.carpe.dalan.dev" client:latest yarn build:prod