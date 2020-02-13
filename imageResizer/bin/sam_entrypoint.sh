#!/bin/bash
set -o errexit

BASEDIR="$1"
# !!!!!! cd_default must be the same as the outer docker network !!!!!!!!!
/usr/local/bin/sam local start-lambda \
  --template template.yaml \
  --host 0.0.0.0 \
  --docker-volume-basedir "${BASEDIR}/imageResizer/" \
  --docker-network cd_default \
  --skip-pull-image $DEBUG_SAM
