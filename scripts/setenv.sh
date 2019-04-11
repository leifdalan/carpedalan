set -e
if [ "$CIRCLE_BRANCH" == "master" ]; then
    export AWS_ACCESS_KEY_ID=${PROD_AWS_ACCESS_KEY_ID}
    export AWS_SECRET_ACCESS_KEY=${PROD_AWS_SECRET_ACCESS_KEY}
    export AWS_DEFAULT_REGION=${PROD_AWS_DEFAULT_REGION}
    export ECS_CLUSTER=${PROD_ECS_CLUSTER}
    export ECS_TASK_DEFINITION=${PROD_ECS_TASK_DEFINITION}
    export ECS_SERVICE=${PROD_ECS_SERVICE}
    export PIPELINE_BUCKET=${PROD_PIPELINE_BUCKET}
    export ASSETS_BUCKET=${PROD_ASSETS_BUCKET}
    export ECR_REPOSITORY=${PROD_ECR_REPOSITORY}
    export CYPRESS_REPOSITORY=${PROD_CYPRESS_REPOSITORY}
else
    export AWS_ACCESS_KEY_ID=${STAGE_AWS_ACCESS_KEY_ID}
    export AWS_SECRET_ACCESS_KEY=${STAGE_AWS_SECRET_ACCESS_KEY}
    export AWS_DEFAULT_REGION=${STAGE_AWS_DEFAULT_REGION}
    export ECS_CLUSTER=${STAGE_ECS_CLUSTER}
    export ECS_TASK_DEFINITION=${STAGE_ECS_TASK_DEFINITION}
    export ECS_SERVICE=${STAGE_ECS_SERVICE}
    export PIPELINE_BUCKET=${STAGE_PIPELINE_BUCKET}
    export ASSETS_BUCKET=${STAGE_ASSETS_BUCKET}
    export ECR_REPOSITORY=${STAGE_ECR_REPOSITORY}
    export CYPRESS_REPOSITORY=${STAGE_CYPRESS_REPOSITORY}
fi
echo 'All set!'