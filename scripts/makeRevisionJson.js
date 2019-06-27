#!/usr/bin/env node

const fs = require('fs');

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
          hostPort: 80,
          protocol: 'tcp',
          containerPort: 80,
        },
        {
          hostPort: 3000,
          protocol: 'tcp',
          containerPort: 3000,
        },
        {
          hostPort: 514,
          protocol: 'tcp',
          containerPort: 514,
        },
        {
          hostPort: 6514,
          protocol: 'tcp',
          containerPort: 6514,
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
