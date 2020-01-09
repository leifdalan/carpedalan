#!/bin/bash

if [ "$PROD_BUILD" = "true" ]; then
  ASSET_CDN_DOMAIN=cdn.local.carpedalan.com yarn webpack --config webpack.config.prod.js --watch
else
  node devServer
fi