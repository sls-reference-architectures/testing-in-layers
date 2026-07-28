import { Logger } from '@aws-lambda-powertools/logger';
import validate from './productValidator';
import ProductsRepository from './productsRepository';

const logger = new Logger({ serviceName: 'testing-in-layers' });
const productsRepo = new ProductsRepository();

export const createProduct = async (product) => {
  logger.debug('In service.createProduct', { product });
  const cleanProduct = validate(product);
  const productToReturn = await productsRepo.save(cleanProduct);

  return productToReturn;
};

export const getProducts = async () => {
  // TODO
};
