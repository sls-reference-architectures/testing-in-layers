import { APIGatewayProxyEvent } from 'aws-lambda';

export interface APIGatewayProxyEventMiddyNormalized<T> extends Omit<APIGatewayProxyEvent, 'body'> {
  queryStringParameters: NonNullable<APIGatewayProxyEvent['queryStringParameters']>;
  multiValueQueryStringParameters: NonNullable<APIGatewayProxyEvent['multiValueQueryStringParameters']>;
  pathParameters: NonNullable<APIGatewayProxyEvent['pathParameters']>;
  body: T;
}
