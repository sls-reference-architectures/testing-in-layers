# testing-in-layers
A reference project to demonstrate testing at unit, int, and e2e layers (this has nothing to do with Lambda "layers")

## The Testing Honeycomb
The "honeycomb" reference is to the inversion of the traditional "Testing Pyramid" into a shape that reflects the proportion of tests at each layer. Layer names are contentious; their definitions are less so. I will focus on the definitions and provide provisional names.

### Unit Tests
What was once the dominant player in the pyramid now becomes a supporting role in the honeycomb. This class of tests is in-memory, fast, and require no deployment and no connectivity. Use this layer to test business logic in a module. The use of mocks/stubs is a code smell - avoid them.

### Integration Tests
Here is where the bulk of our testing efforts should fall. Integration tests drive both your code and the stable<sup>[1](#foot01)</sup> services it uses. For example, an integration test for a repository module that uses DynamoDB would hit a real, live DynamoDB. An integration test for a Lambda that writes to S3 would invoke that handler directly and verify the written object in S3. This class of tests differs from Unit tests by allowing network connectivity and differs from E2E tests by not requiring a deployment<sup>[2](#foot02)</sup>. This no-deployment requirement significantly reduces the cost of the test and provides relatively fast feedback to the caller.

### End-to-End (E2E) Tests
This set of tests drives the system more like a user would. These tests almost always require a deployment prior to execution and are therefore much more expensive to run and get feedback. For example, to test an API endpoint that creates a Product resource, we would issue an HTTP POST to the ApiGateway URL with a proper payload. To verify we could either check the database or, if you have a GET for the resource, we could issue an HTTP GET<sup>[3](#foot03)</sup>.

## Project Layout
This project aims to provide appropriate working examples of each type of test layer. To do so, I'll set up a [Simple Web Service pattern](https://www.jeremydaly.com/serverless-microservice-patterns-for-aws/#simplewebservice) that will create a "Product". It will have some basic input validation, write the record to the database, and return the newly-created id to the caller.

The tests all reside in the `/test` directory and differ from one another by file name. Unit tests end with `.unit.test.ts`, Integration tests with `.int.test.ts`, and E2E tests with `.e2e.test.ts`. The unit tests cover the input validation with all its corner-cases. The integration tests cover both the repository layer and the Lambda handler that invokes it. Finally, the e2e tests ensure the ApiGateway is correctly configured and the Lambda has proper permissions.

Note that some overlap is both expected and intended. E.g., a 400 at the integration level is almost identical to one from the unit test level (except we should see the error turn into a response code). Both tests are relatively cheap, so the overlap is fine. However, I would not re-run this test at the e2e level as it provides nothing new. By testing ApiGateway with one, happy-path e2e test we know that we are forming our responses correctly and it will map the right status code.

## Running the Project
Take a look at the steps and variables used in the `.github/workflows/ci.yml` file. That will give you an overview of all that is necessary to run/deploy any part of the project.

In a nutshell,
- `$ npm ci`
- To run unit tests just `$ npm t`
- To run integration tests:
  - `$ export NODE_ENV=dev`
  - `$ export AWS_PROFILE=<your_profile>`
  - `$ npm run test:int`
- To run end-to-end tests:
  - `$ export NODE_ENV=dev`
  - `$ export AWS_PROFILE=<your_profile>`
  - `$ npm run deploy`
  - `$ npm run test:e2e`

## References
 - [Yan Cui: Yubl's Serverless Testing](https://medium.com/hackernoon/yubls-road-to-serverless-part-2-testing-and-ci-cd-72b2e583fe64)
 - [Yan Cui's AppSync Masterclass: Chapter 4, Lesson 5](https://theburningmonk.thinkific.com/courses/take/appsync-masterclass-premium/lessons/17643894-what-should-we-test)
 - [Paul Swail: Integration & E2E Tests](https://serverlessfirst.com/integration-e-2-e-tests/)
 - [Spotify R&D](https://engineering.atspotify.com/2018/01/11/testing-of-microservices/)
 - [Mocks & Stubs (Imagine a world w/o mocks)](https://www.youtube.com/watch?v=EaxDl5NPuCA)

## Footnotes
<a name="foot01">1</a>: By "stable", I mean a service that is always available. E.g., AWS, Stripe, or Algolia. Examples of unstable services include most of the services your team deploys

<a name="foot02">2</a>: Many of these integration tests require infrastructure that does require an initial "deployment" but can be tested in a later pass. E.g., I may provision a DDB table up front, deploy it, and then write my repository module with all its integration tests that use the DB.

<a name="foot03">3</a>: Tests that use existing endpoints to verify (and sometimes to clean up) can often be run in higher environments - even in Production. I have sometimes categorized these as "smoke" tests. These smoke tests could potentially run on a timer - every N minutes - and raise alerts to the team if they ever fail.