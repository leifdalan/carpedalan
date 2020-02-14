#!/bin/bash
set -o errexit
# pushd "$(cd "$(dirname "$0")" ; pwd -P )/.." > /dev/null
function down() {
  docker-compose down
}
[ ! -d "imageResizer/src/node_modules" ] && echo 'Installing layer deps...' && docker run -v "$PWD/imageResizer/src":/var/task lambci/lambda:build-nodejs12.x npm install sharp sqip knex exif-parser pg aws-sdk
trap down EXIT
docker-compose logs -f client alb
