set -e
docker build -t $ECR:$CI_COMMIT_SHA \
  -t app:latest \
  -f Dockerfile.prod \
  --target prod \
  --build-arg CIRCLE_SHA1=$CIRCLE_SHA1 \
  --build-arg AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
  --build-arg AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
  --build-arg S3_ASSETS_BUCKET=$(pulumi stack output assetBucket)
  --build-arg ASSET_CDN_DOMAIN=$(pulumi stack output cdnDomain)