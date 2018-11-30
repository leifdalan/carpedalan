import docker from 'docker-compose';

module.exports = async () => {
  docker.down({ config: 'docker-compose.integration.yml' });
};
