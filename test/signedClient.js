import { aws4Interceptor } from 'aws4-axios';
import axios from 'axios';

// The API is protected by `authorizer: aws_iam`, so requests have to carry a
// SigV4 signature. The interceptor has to be registered on the instance:
// clients built with axios.create() do not inherit interceptors from the
// default `axios` object.
const createSignedClient = (config = {}) => {
  const client = axios.create(config);
  client.interceptors.request.use(
    aws4Interceptor({
      options: {
        region: process.env.AWS_REGION || 'us-east-1',
        service: 'execute-api',
      },
    }),
  );

  return client;
};

export default createSignedClient;
