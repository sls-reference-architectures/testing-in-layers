import Logger from '@dazn/lambda-powertools-logger';
import errorHandler from '@middy/http-error-handler';
import jsonBodyParser from '@middy/http-json-body-parser';
import middy from '@middy/core';

import * as service from './productsService';

const createProduct = async (event) => {
  Logger.debug('In createProduct handler', { event });
  const { body: newProduct } = event;
  const result = await service.createProduct(newProduct);

  return {
    statusCode: 201,
    body: JSON.stringify(result),
  };
};

// eslint-disable-next-line import/prefer-default-export -- Lambda runtime requires a named export
export const handler = middy(createProduct)
  .use(jsonBodyParser())
  .use(errorHandler());
