#!/bin/bash
set -o errexit

BASEDIR="$1"
/usr/local/bin/sam local start-lambda \
  --template template.yaml \
  --host 0.0.0.0 \
  --docker-volume-basedir "${BASEDIR}/imageresizer/" \
  --docker-network carpedalan_default \
  --skip-pull-image \
  -d 5959
