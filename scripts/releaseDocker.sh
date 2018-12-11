set -e
docker login --username=_ --password=${HEROKU_PASSWORD} registry.heroku.com
docker push registry.heroku.com/carpedalan/web
WEB_DOCKER_IMAGE_ID=`\
  docker inspect \
  registry.heroku.com/carpedalan/web \
  --format={{.Id}} | sed -n 1p`
echo $WEB_DOCKER_IMAGE_ID
curl -n -X PATCH https://api.heroku.com/apps/carpedalan/formation \
  -d "{
  \"updates\": [
    {
      \"type\": \"web\",
      \"docker_image\": \"${WEB_DOCKER_IMAGE_ID}\"
    }
  ]
}" \
  -H "Content-Type: application/json" \
  -H "Accept: application/vnd.heroku+json; version=3.docker-releases" \
  -H "Authorization: Bearer $HEROKU_PASSWORD"