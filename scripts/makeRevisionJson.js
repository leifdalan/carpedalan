#!/usr/bin/env node

const fs = require('fs');

const { ECR_ENDPOINT, CIRCLE_SHA1 } = process.env;
const json = {
  containerDefinitions: [
    {
      logConfiguration: {
        logDriver: 'awslogs',
        options: {
          'awslogs-group': '/ecs/carpedalan',
          'awslogs-region': 'us-east-1',
          'awslogs-stream-prefix': 'ecs',
        },
      },
      image: `${ECR_ENDPOINT}/carpedev:${CIRCLE_SHA1}`,
      name: 'carpedalan',
      memoryReservation: 512,
      cpu: 256,
      portMappings: [
        {
          containerPort: 80,
          hostPort: 80,
          protocol: 'tcp',
        },
      ],
    },
  ],
  taskRoleArn: 'arn:aws:iam::771396871964:role/ecsTaskExecutionRole',
  family: 'carpedalan',
  networkMode: 'awsvpc',
  volumes: [],
};

fs.writeFileSync('container-definition.json', JSON.stringify(json), 'utf8');
