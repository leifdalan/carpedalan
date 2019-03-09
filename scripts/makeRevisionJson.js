#!/usr/bin/env node

const fs = require('fs');

const dotenv = require('dotenv-safe');

dotenv.config();
const { ECR_REPOSITORY, CIRCLE_SHA1 } = process.env;
const json = {
  containerDefinitions: [
    {
      logConfiguration: {
        logDriver: 'awslogs',
        options: {
          'awslogs-group': '/ecs/carpedalan',
          'awslogs-region': 'us-west-2',
          'awslogs-stream-prefix': 'ecs',
        },
      },
      image: `${ECR_REPOSITORY}:${CIRCLE_SHA1}`,
      name: 'carpedalan',
      portMappings: [
        {
          containerPort: 80,
          hostPort: 80,
          protocol: 'tcp',
        },
      ],
    },
  ],
  memory: '512',
  cpu: '1024',
  family: 'carpedalan',
  networkMode: 'awsvpc',
  volumes: [],
  requiresCompatibilities: ['EC2'],
};

fs.writeFileSync('container-definition.json', JSON.stringify(json), 'utf8');
