docker build -t client:latest -f client/Dockerfile ./client
docker build -t api:latest -f server/Dockerfile . --target=dev
docker build -t registry.gitlab.com/carpedalan/carpedalan-web/cypress:latest -f cypress/Dockerfile ./cypress