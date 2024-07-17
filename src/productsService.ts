import Logger from '@dazn/lambda-powertools-logger';
import { Created, Product } from './models';
import validate from './productValidator';
import ProductsRepository from './productsRepository';

const productsRepo = new ProductsRepository();

export const createProduct = async (product: Product): Promise<Created> => {
  Logger.debug('In service.createProduct', { product });
  const cleanProduct = validate(product);
  const productToReturn = await productsRepo.save(cleanProduct);

  return productToReturn;
};

export const getProducts = async () => {
  // TODO
};
