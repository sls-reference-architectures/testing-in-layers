import { ulid } from 'ulid';

import ProductsRepository from '../src/productsRepository';
import { removeProductsFromDB } from './awsUtils';
import { generateProduct } from './testModels';

describe('When saving a Product', () => {
  let sut: ProductsRepository;
  const testProductIds: string[] = [];

  beforeEach(() => {
    sut = new ProductsRepository();
  });

  afterAll(async () => {
    await removeProductsFromDB(testProductIds);
  });

  it('should write Product to DB', async () => {
    // ARRANGE
    const product = generateProduct();

    // ACT
    const { id } = await sut.save(product);
    testProductIds.push(id);

    // ASSERT
    await expect({
      region: 'us-east-1',
      table: process.env.TABLE_NAME,
    }).toHaveItem(
      { id },
      {
        name: product.name,
        price: product.price,
        description: product.description,
      },
      false,
    );
  });

  it('should write overwrite any provided id', async () => {
    // ARRANGE
    const preExistingId = ulid();
    const product = generateProduct();
    product.id = preExistingId;

    // ACT
    const { id } = await sut.save(product);
    testProductIds.push(id);

    // ASSERT
    expect(id).not.toEqual(preExistingId);
  });
});
