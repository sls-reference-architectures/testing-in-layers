import {
  CloudFormationClient,
  DescribeStacksCommand,
  Stack,
} from '@aws-sdk/client-cloudformation';

const region = process.env.AWS_REGION || 'us-east-1';
const stage = process.env.NODE_ENV || 'dev';

const setup = async (): Promise<void> => {
  const stackName = `testing-in-layers-${stage}`;
  const stack = await getStack(stackName);

  process.env.API_URL = getApiUrl(stack);
  process.env.TABLE_NAME = getTableName(stack);
  process.env.AWS_REGION = region;
  process.env.NODE_ENV = stage;
};

const getStack = async (stackName: string): Promise<Stack> => {
  const cf = new CloudFormationClient({ region });
  const stackResult = await cf.send(
    new DescribeStacksCommand({
      StackName: stackName,
    }),
  );
  const stack = stackResult.Stacks?.[0];
  if (!stack) {
    throw new Error(`Couldn't find CF stack with name ${stackName}`);
  }

  return stack;
};

const getApiUrl = (stack: Stack): string | undefined => {
  const apiUrl = getHttpApiUrl(stack);
  if (apiUrl) {
    return apiUrl;
  }

  return getRestApiUrl(stack);
};

const getRestApiUrl = (stack: Stack) => (
  stack.Outputs?.find((o) => o.OutputKey === 'ServiceEndpoint')?.OutputValue
);

const getHttpApiUrl = (stack: Stack) => (
  stack.Outputs?.find((o) => o.OutputKey === 'HttpApiUrl')?.OutputValue
);

const getTableName = (stack: Stack) => (
  stack.Outputs?.find((o) => o.OutputKey === 'TableName')?.OutputValue
);

export default setup;
