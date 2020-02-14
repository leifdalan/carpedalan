
docker run -v "$PWD":/var/task lambci/lambda:build-nodejs12.x npm install sharp sqip knex exif-parser pg aws-sdk