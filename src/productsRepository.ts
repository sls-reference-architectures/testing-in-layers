import { DynamoDBDocumentClient, PutCommandInput, PutCommand } from '@aws-sdk/lib-dynamodb';
import { ulid } from 'ulid';
import { Created, Product } from './models';
import getDocumentClient from './documentClient';

export default class ProductsRepository {
  private docClient: DynamoDBDocumentClient;

  constructor() {
    this.docClient = getDocumentClient();
  }

  async save(product: Product): Promise<Created> {
    const productToSave: Product = { ...product, id: ulid() };
    const putParams: PutCommandInput = {
      Item: productToSave,
      TableName: process.env.TABLE_NAME ?? '',
    };
    await this.docClient.send(new PutCommand(putParams));
    return { id: productToSave.id as string };
  }
}
