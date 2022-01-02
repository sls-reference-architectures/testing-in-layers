import faker from 'faker';
import { ulid } from 'ulid';
import { Created, Product } from '../src/models';

const generateProduct = (): Product => ({
  id: `test_${ulid()}`,
  name: faker.commerce.productName(),
  price: +faker.commerce.price(),
  description: faker.lorem.paragraph().substring(0, 500),
});

const generateCreated = (): Created => ({
  id: `test_${ulid()}`,
});

export {
  generateProduct,
  generateCreated,
};
