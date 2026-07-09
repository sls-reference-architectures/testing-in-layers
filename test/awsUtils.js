import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import Logger from '@dazn/lambda-powertools-logger';
import { faker } from '@faker-js/faker';
import { ulid } from 'ulid';

import { generateProduct } from './testModels';
import getDocumentClient from '../src/documentClient';

const removeProductFromDB = async (id) => {
  try {
    const deleteParams = {
      Key: { id },
      TableName: process.env.TABLE_NAME ?? '',
    };
    const docClient = getDocumentClient();
    await docClient.send(new DeleteCommand(deleteParams));
  } catch (err) {
    Logger.error('Failed to remove item from DB', err);
  }
};

const removeProductsFromDB = async (ids) => {
  const deletePromises = ids.map((id) => removeProductFromDB(id));
  await Promise.all(deletePromises);
};

const createApiGatewayEvent = (product = generateProduct()) => ({
  body: JSON.stringify(product),
  headers: { 'Content-Type': 'application/json' },
  queryStringParameters: {},
  multiValueQueryStringParameters: {},
  pathParameters: {},
});

const createEmptyContext = () => ({
  callbackWaitsForEmptyEventLoop: true,
  functionName: faker.internet.domainName(),
  functionVersion: faker.system.semver(),
  invokedFunctionArn: faker.lorem.slug(),
  memoryLimitInMB: '42MB',
  awsRequestId: `AWS-Test-${ulid()}`,
  logGroupName: faker.lorem.slug(),
  logStreamName: faker.lorem.slug(),
  done: emptyFunction,
  fail: emptyFunction,
  succeed: emptyFunction,
  getRemainingTimeInMillis: () => 29000,
});

const emptyFunction = () => (null);

export {
  createApiGatewayEvent,
  createEmptyContext,
  removeProductFromDB,
  removeProductsFromDB,
};
