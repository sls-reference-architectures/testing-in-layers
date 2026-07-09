import { faker } from '@faker-js/faker';
import { ulid } from 'ulid';

const generateProduct = () => ({
  id: `test_${ulid()}`,
  name: faker.commerce.productName(),
  price: +faker.commerce.price(),
  description: faker.lorem.paragraph().substring(0, 500),
});

const generateCreated = () => ({
  id: `test_${ulid()}`,
});

export {
  generateProduct,
  generateCreated,
};
