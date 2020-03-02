#!/bin/bash
set -e
aws ecs put-account-setting-default --name serviceLongArnFormat --value enabled "$@"
aws ecs put-account-setting-default --name taskLongArnFormat --value enabled "$@"
aws ecs put-account-setting-default --name containerInstanceLongArnFormat --value enabled "$@"
