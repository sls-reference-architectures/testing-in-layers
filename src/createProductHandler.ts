import { APIGatewayProxyResult } from 'aws-lambda';
import Logger from '@dazn/lambda-powertools-logger';
import errorHandler from '@middy/http-error-handler';
import jsonBodyParser from '@middy/http-json-body-parser';
import middy from '@middy/core';

import { Product } from './models';
import { APIGatewayProxyEventMiddyNormalized } from './types';
import * as service from './productsService';

const createProduct = async (
  event: APIGatewayProxyEventMiddyNormalized<Product>,
): Promise<APIGatewayProxyResult> => {
  Logger.debug('In createProduct handler', { event });
  const newProduct = event.body;
  const result = await service.createProduct(newProduct);

  return {
    statusCode: 201,
    body: JSON.stringify(result),
  };
};

const handler = middy(createProduct)
  .use(jsonBodyParser())
  .use(errorHandler());

export default handler;
