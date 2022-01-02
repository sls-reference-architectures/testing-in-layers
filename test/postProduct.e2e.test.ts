import axios, { AxiosResponse } from 'axios';
import { removeProductFromDB } from './awsUtils';
import { generateProduct } from './testModels';

describe('Given a product', () => {
  const product = generateProduct();

  describe('when POSTing it to API', () => {
    let postResult: AxiosResponse;

    beforeAll(async () => {
      const axiosInstance = axios.create({
        baseURL: process.env.API_URL,
        validateStatus: () => true,
      });
      postResult = await axiosInstance.post('/products', product);
    });

    afterAll(async () => {
      await removeProductFromDB(postResult.data.id);
    });

    it('should return 201', () => {
      expect(postResult.status).toEqual(201);
    });

    it('should return id of product now in DB', async () => {
      await expect({
        region: 'us-east-1',
        table: process.env.TABLE_NAME,
      }).toHaveItem(
        { id: postResult.data.id },
        {
          name: product.name,
          price: product.price,
          description: product.description,
        },
        false,
      );
    });
  });
});
