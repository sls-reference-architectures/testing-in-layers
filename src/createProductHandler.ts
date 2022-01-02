import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import Logger from '@dazn/lambda-powertools-logger';
import httpErrorHandler from '@middy/http-error-handler';
import middy from '@middy/core';

import ProductsRepository from './productsRepository';
import validate from './productValidator';

const productsRepo = new ProductsRepository();

const createProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  Logger.debug('In createProduct handler', { event });
  const newProduct = JSON.parse(event.body || '{}');
  const cleanProduct = validate(newProduct);
  const result = await productsRepo.save(cleanProduct);

  return {
    statusCode: 201,
    body: JSON.stringify(result),
  };
};

const handler = middy(createProduct)
  .use(httpErrorHandler());

export default handler;
