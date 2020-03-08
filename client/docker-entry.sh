#!/bin/bash
set -e
if [ "$PROD_BUILD" = "true" ]; then
  DEFAULT_POSTS_PER_PAGE=$DEFAULT_POSTS_PER_PAGE ASSET_CDN_DOMAIN=cdn.local.carpedalan.com yarn webpack --config webpack.config.prod.js --watch
else
  node devServer
fi