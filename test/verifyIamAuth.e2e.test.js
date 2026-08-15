import axios from 'axios';

import { generateProduct } from './testModels';

// A plain axios.create() client, with no SigV4 interceptor — the API should
// turn it away.
const unsignedClient = axios.create({
  baseURL: process.env.API_URL,
  validateStatus: () => true,
});

describe('Given a product', () => {
  describe('when POSTing it to API without a SigV4 signature', () => {
    it('should be rejected with a 403', async () => {
      // ARRANGE
      const product = generateProduct();

      // ACT
      const { status } = await unsignedClient.post('/products', product);

      // ASSERT
      expect(status).toEqual(403);
    });
  });
});
