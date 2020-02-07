npm install --no-cache --arch=x64 --platform=linux --target=12.13.0 sharp
tar -xvf false/_libvips/libvips-8.8.1-linux-x64.tar.gz
docker run -v "$PWD":/var/task lambci/lambda:build-nodejs12.x npm install sharp sqip knex exif-parser pg aws-sdk