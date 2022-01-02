import Logger from '@dazn/lambda-powertools-logger';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import faker from 'faker';
import { ulid } from 'ulid';

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

const createApiGatewayEvent = (product = generateProduct()): APIGatewayProxyEvent => ({
  body: JSON.stringify(product),
  headers: {},
} as APIGatewayProxyEvent);

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
