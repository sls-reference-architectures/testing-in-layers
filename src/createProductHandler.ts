import { APIGatewayProxyResult, Context } from 'aws-lambda';
import Logger from '@dazn/lambda-powertools-logger';
import errorHandler from '@middy/http-error-handler';
import jsonBodyParser from '@middy/http-json-body-parser';
import middy from '@middy/core';

import ProductsRepository from './productsRepository';
import validate from './productValidator';
import { Product } from './models';
import { APIGatewayProxyEventMiddyNormalized } from './types';

const productsRepo = new ProductsRepository();

const createProduct = async (
  event: APIGatewayProxyEventMiddyNormalized<Product>,
): Promise<APIGatewayProxyResult> => {
  Logger.debug('In createProduct handler', { event });
  const newProduct = event.body;
  const cleanProduct = validate(newProduct);
  const result = await productsRepo.save(cleanProduct);

  return {
    statusCode: 201,
    body: JSON.stringify(result),
  };
};

const handler = middy(createProduct)
  .use(jsonBodyParser())
  .use(errorHandler());

export default handler;
