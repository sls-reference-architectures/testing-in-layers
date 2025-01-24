import { faker } from '@faker-js/faker';
import { Product } from '../src/models';

import validate from '../src/productValidator';
import { generateProduct } from './testModels';

describe('When using the Product validator', () => {
  describe('with a valid product', () => {
    it('should no-op', () => {
      // ARRANGE
      const validProduct = generateProduct();

      // ACT
      const validateAction = () => validate(validProduct);

      // ASSERT
      expect(validateAction).not.toThrow();
    });
  });

  describe('and the product has no name', () => {
    it('should throw 400', () => {
      // ARRANGE
      const product = generateProduct();
      product.name = '';

      // ACT
      const validateAction = () => validate(product);

      // ASSERT
      expect(validateAction).toThrow(/Bad Request/);
      expect(validateAction).toThrow(/"name"/);
    });
  });

  describe('and the product has no price', () => {
    it('should throw 400', () => {
      // ARRANGE
      const product = generateProduct();
      product.price = NaN;

      // ACT
      const validateAction = () => validate(product);

      // ASSERT
      expect(validateAction).toThrow(/Bad Request/);
      expect(validateAction).toThrow(/"price"/);
    });
  });

  describe('and the product has price of zero', () => {
    it('should throw 400', () => {
      // ARRANGE
      const product = generateProduct();
      product.price = 0;

      // ACT
      const validateAction = () => validate(product);

      // ASSERT
      expect(validateAction).toThrow(/Bad Request/);
      expect(validateAction).toThrow(/"price"/);
    });
  });

  describe('and the product has a negative price', () => {
    it('should throw 400', () => {
      // ARRANGE
      const product = generateProduct();
      product.price = faker.number.int({ min: -10, max: -1 });

      // ACT
      const validateAction = () => validate(product);

      // ASSERT
      expect(validateAction).toThrow(/Bad Request/);
      expect(validateAction).toThrow(/"price"/);
    });
  });

  describe('and the product is missing both name and price', () => {
    it('should throw 400 with both errors in message', () => {
      // ARRANGE
      const product = generateProduct();
      product.price = NaN;
      product.name = '';

      // ACT
      const validateAction = () => validate(product);

      // ASSERT
      expect(validateAction).toThrow(/Bad Request/);
      expect(validateAction).toThrow(/"price"/);
      expect(validateAction).toThrow(/"name"/);
    });
  });

  describe('and the product has no description', () => {
    it('should throw 400', () => {
      // ARRANGE
      const product = generateProduct();
      delete product.description;

      // ACT
      const validateAction = () => validate(product);

      // ASSERT
      expect(validateAction).not.toThrow();
    });
  });

  describe('and the product description is over 500 characters', () => {
    it('should throw 400', () => {
      // ARRANGE
      const product = generateProduct();
      product.description = faker.string.alpha({ length: 501 });

      // ACT
      const validateAction = () => validate(product);

      // ASSERT
      expect(validateAction).toThrow(/Bad Request/);
      expect(validateAction).toThrow(/"description"/);
    });
  });

  describe('and the product has extra field', () => {
    it('should strip it out', () => {
      // ARRANGE
      const productWithExtraField = generateProduct();
      productWithExtraField.id = 'x';

      // ACT
      const validProduct = validate(productWithExtraField);

      // ASSERT
      expect(validProduct).not.toHaveProperty('id');
    });
  });

  describe('with a null input', () => {
    it('should throw 400', () => {
      // ARRANGE
      const product = null as unknown;

      // ACT
      const validateAction = () => validate(product as Product);

      // ASSERT
      expect(validateAction).toThrow(/Bad Request/);
      expect(validateAction).toThrow(/object/);
    });
  });
});
