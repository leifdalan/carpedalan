#!/bin/bash
set -o errexit
# pushd "$(cd "$(dirname "$0")" ; pwd -P )/.." > /dev/null
function down() {
  docker-compose down
}
[ ! -d "imageResizer/src/node_modules" ] && echo 'Installing layer deps...' && docker run -v "$PWD/imageResizer/src":/var/task lambci/lambda:build-nodejs12.x npm install sharp@0.24.1 knex@0.20.10 exif-parser@0.1.12 sqip@0.3.3 redis@3.0.2 pg
trap down EXIT
docker-compose logs -f client alb
