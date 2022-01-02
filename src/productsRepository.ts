import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ulid } from 'ulid';
import { Created, Product } from './models';

export default class ProductsRepository {
  private docClient: DocumentClient;

  constructor() {
    this.docClient = new DocumentClient();
  }

  async save(product: Product): Promise<Created> {
    const productToSave: Product = { ...product, id: ulid() };
    const putParams: DocumentClient.PutItemInput = {
      Item: productToSave,
      TableName: process.env.TABLE_NAME ?? '',
    };
    await this.docClient.put(putParams).promise();

    return { id: productToSave.id as string };
  }
}
