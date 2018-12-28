set -e
echo "**************** Beginning DB Migration ****************"
yarn knex migrate:latest --knexfile db/setup.js
yarn knex migrate:latest --knexfile db/knexfile.js
yarn knex seed:run --knexfile db/knexfile.js
echo "**************** Finished DB Migration ****************"