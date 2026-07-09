import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { ulid } from 'ulid';
import getDocumentClient from './documentClient';

export default class ProductsRepository {
  constructor() {
    this.docClient = getDocumentClient();
  }

  async save(product) {
    const productToSave = { ...product, id: ulid() };
    const putParams = {
      Item: productToSave,
      TableName: process.env.TABLE_NAME ?? '',
    };
    await this.docClient.send(new PutCommand(putParams));
    return { id: productToSave.id };
  }
}
