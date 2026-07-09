import Logger from '@dazn/lambda-powertools-logger';
import validate from './productValidator';
import ProductsRepository from './productsRepository';

const productsRepo = new ProductsRepository();

export const createProduct = async (product) => {
  Logger.debug('In service.createProduct', { product });
  const cleanProduct = validate(product);
  const productToReturn = await productsRepo.save(cleanProduct);

  return productToReturn;
};

export const getProducts = async () => {
  // TODO
};
