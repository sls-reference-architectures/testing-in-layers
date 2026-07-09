# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm ci                        # install dependencies
npx sls deploy                # deploy to AWS (required before int/e2e tests)
npm t                         # lint + unit tests with coverage
npm run test:int              # integration tests (requires deployed stack)
npm run test:e2e              # e2e tests (requires deployed stack)
```

To run a single test file:
```bash
npx jest productValidator --config jest.config.js   # unit
npx jest createProductHandler --config jest.config.int.js  # int
```

Int and e2e tests require `STAGE=dev` (set automatically by the npm scripts) and valid AWS credentials (`aws s3 ls` to verify).

## Architecture

A Simple Web Service pattern: API Gateway → Lambda → DynamoDB.

**Request path:** `createProductHandler` (middy middleware stack: JSON body parser + error handler) → `productsService` (validates then delegates) → `productValidator` (Joi schema, throws `http-errors` `BadRequest` on failure) → `ProductsRepository` (DynamoDB `PutItem`, assigns a ULID as `id`).

`documentClient.js` is a lazy singleton wrapping `DynamoDBDocumentClient`. The DynamoDB table name comes from `process.env.TABLE_NAME`, which is injected by the Serverless framework at deploy time and resolved from CloudFormation outputs by `jest.setup.js` at test time.

## Test Layer Philosophy

- **Unit** (`*.unit.test.js`): in-memory, no network, no mocks. Tests pure logic — currently only `productValidator`.
- **Integration** (`*.int.test.js`): invokes the Lambda handler or repository directly in-process against a real deployed DynamoDB table. No HTTP. Requires a deployed stack but not a full HTTP round-trip.
- **E2E** (`*.e2e.test.js`): issues real HTTP requests via `axios` to the deployed API Gateway URL. One happy-path test only — validates gateway config and Lambda permissions, not business logic.

`jest.setup.js` (globalSetup for int/e2e) resolves `API_URL` and `TABLE_NAME` from the CloudFormation stack outputs automatically — no manual env var setup needed beyond `STAGE`.

Test data uses `generateProduct()` from `test/testModels.js` (faker + ULID). Integration and e2e tests clean up after themselves by deleting created records in `afterAll`.

## Key Conventions

- `id` is a ULID assigned at write time in the repository; callers never supply it (the validator strips unknown fields including any `id` on the way in).
- The validator uses `abortEarly: false` and `stripUnknown: true` — all validation errors are collected and returned together, and unknown fields are silently stripped.
- Middy's `http-error-handler` middleware converts `http-errors` exceptions (including the `BadRequest` thrown by the validator) into properly shaped API Gateway responses automatically.
