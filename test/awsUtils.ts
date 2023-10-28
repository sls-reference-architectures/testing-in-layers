import { DeleteCommand, DeleteCommandInput } from '@aws-sdk/lib-dynamodb';
import Logger from '@dazn/lambda-powertools-logger';
import { Context } from 'aws-lambda';
import { faker } from '@faker-js/faker';
import { ulid } from 'ulid';
import { Product } from '../src/models';
import { APIGatewayProxyEventMiddyNormalized } from '../src/types';

import { generateProduct } from './testModels';
import getDocumentClient from '../src/documentClient';

const removeProductFromDB = async (id: string): Promise<void> => {
  try {
    const deleteParams: DeleteCommandInput = {
      Key: { id },
      TableName: process.env.TABLE_NAME ?? '',
    };
    const docClient = getDocumentClient();
    await docClient.send(new DeleteCommand(deleteParams));
  } catch (err) {
    Logger.error('Failed to remove item from DB', err as Error);
  }
};

const removeProductsFromDB = async (ids: string[]): Promise<void> => {
  const deletePromises = ids.map((id) => removeProductFromDB(id));
  await Promise.all(deletePromises);
};

const createApiGatewayEvent = (
  product = generateProduct(),
): APIGatewayProxyEventMiddyNormalized<Product> => ({
  body: product,
  headers: {},
  queryStringParameters: {},
  multiValueQueryStringParameters: {},
  pathParameters: {},
} as APIGatewayProxyEventMiddyNormalized<Product>);

const createEmptyContext = (): Context => ({
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
