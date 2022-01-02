import { APIGatewayProxyResult } from 'aws-lambda';

import { generateProduct } from './testModels';
import handler from '../src/createProductHandler';
import { createApiGatewayEvent, createEmptyContext, removeProductsFromDB } from './awsUtils';

describe('When invoking the createProduct handler', () => {
  const testProductIds: string[] = [];
  const emptyContext = createEmptyContext();
  const emptyCallback = () => (null);

  afterAll(async () => {
    await removeProductsFromDB(testProductIds);
  });

  describe('with a valid product', () => {
    const product = generateProduct();
    let createProductResult: APIGatewayProxyResult;

    beforeAll(async () => {
      const event = createApiGatewayEvent(product);
      createProductResult = await handler(
        event,
        emptyContext,
        emptyCallback,
      ) as APIGatewayProxyResult;
      const { id } = JSON.parse(createProductResult.body);
      testProductIds.push(id);
    });

    it('should return a 201 status code', () => {
      expect(createProductResult.statusCode).toEqual(201);
    });

    it('should return the id of the saved product', () => {
      const parsedResult = JSON.parse(createProductResult.body);
      expect(parsedResult).toHaveProperty('id');
    });

    it('should save the product to the DB', async () => {
      const parsedResult = JSON.parse(createProductResult.body);
      await expect({
        region: 'us-east-1',
        table: process.env.TABLE_NAME,
      }).toHaveItem(
        { id: parsedResult.id },
        {
          name: product.name,
          price: product.price,
          description: product.description,
        },
        false,
      );
    });
  });

  describe('with an invalid product', () => {
    let createProductResult: APIGatewayProxyResult;

    beforeAll(async () => {
      const invalidProduct = generateProduct();
      invalidProduct.name = '';
      const event = createApiGatewayEvent(invalidProduct);
      createProductResult = await handler(
        event,
        emptyContext,
        emptyCallback,
      ) as APIGatewayProxyResult;
    });

    it('should return a 400 status code', () => {
      expect(createProductResult.statusCode).toEqual(400);
    });
  });
});
