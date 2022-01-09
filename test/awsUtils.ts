import Logger from '@dazn/lambda-powertools-logger';
import { Context } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import faker from 'faker';
import { ulid } from 'ulid';
import { Product } from '../src/models';
import { APIGatewayProxyEventMiddyNormalized } from '../src/types';

import { generateProduct } from './testModels';

const removeProductFromDB = async (id: string): Promise<void> => {
  try {
    const deleteParams: DocumentClient.DeleteItemInput = {
      Key: { id },
      TableName: process.env.TABLE_NAME ?? '',
    };
    const docClient = new DocumentClient();
    await docClient.delete(deleteParams).promise();
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
  getRemainingTimeInMillis: () => (42),
});

const emptyFunction = () => (null);

export {
  createApiGatewayEvent,
  createEmptyContext,
  removeProductFromDB,
  removeProductsFromDB,
};
