# testing-in-layers
A reference project to demonstrate testing at unit, int, and e2e layers (this has nothing to do with Lambda "layers")

## The Layers
One way to visualize the concept of testing "layers" is the traditional "Testing Pyramid" (or the more recent "Testing Honeycomb") with its horizontal bands each representing a layer. In most models, they share some common, often-encountered layers: typically the "Unit" layer and, just above it, the "Integration" layer. I am going to dig into this so-called integration layer to argue that we can devise a meaningful litmus test for splitting it into dedicated layers.

Layer names are contentious; their definitions are less so. I will focus on the definitions and provide provisional names.

### Unit Tests
What was once the dominant player in the pyramid now becomes a supporting role in the test suite. This class of tests is in-memory, fast, and requires no deployment and no connectivity. Use this layer to test business logic in a module. The use of mocks/stubs is a code smell - avoid them<sup>[1](#foot01)</sup>.

### Integration Tests
Here is where the bulk of our testing efforts should fall. Integration tests drive both your code and the stable<sup>[2](#foot02)</sup> services it uses. For example, an integration test for a repository module that uses DynamoDB would hit a real, live DynamoDB. An integration test for a Lambda that writes to S3 would invoke that handler directly and verify the written object in S3. This class of tests differs from Unit tests by allowing network connectivity and differs from E2E tests by *not requiring a deployment*<sup>[3](#foot03)</sup>. This no-deployment requirement significantly reduces the cost of the test and provides relatively fast feedback to the caller.

### End-to-End (E2E) Tests
This set of tests drives the system like a user would. These tests almost always require a deployment prior to execution and are therefore much more expensive to run and get feedback. For example, to test an API endpoint that creates a Product resource, we would issue an HTTP POST to the ApiGateway URL with a proper payload. To verify we could either check the database or, if you have a GET for the resource, we could issue an HTTP GET<sup>[4](#foot04)</sup>.

## Project Layout
This project aims to provide appropriate working examples of each type of test layer. To do so, I'll set up a [Simple Web Service pattern](https://www.jeremydaly.com/serverless-microservice-patterns-for-aws/#simplewebservice) that will create a "Product". It will have some basic input validation, write the record to the database, and return the newly-created id to the caller.

The tests all reside in the `/test` directory and differ from one another by file name. Unit tests end with `*.unit.test.ts`, Integration tests with `*.int.test.ts`, and E2E tests with `*.e2e.test.ts`. The unit tests cover the input validation with all its corner-cases. The integration tests cover both the repository layer and the Lambda handler that invokes it. Finally, the e2e tests ensure the ApiGateway is correctly configured and the Lambda has proper permissions.

Note that some overlap is both expected and intended. E.g., a 400 at the integration level is almost identical to one from the unit test level (except we should see the error turn into a response code). Both tests are relatively cheap, so the overlap is fine. However, I would not re-run this test at the e2e level as it provides nothing new. By testing ApiGateway with one, happy-path e2e test we know that we are forming our responses correctly and it will map the right status code.

## To Deploy and Run
First, do whatever is necessary to have CLI access to your AWS account (you can quickly verify this with `aws s3 ls` or similar). Then you will want to deploy the project. See section below for further discussion of pre-deployment vs. post-deployment testing how you arrive at that situation.

To deploy,
- `$ npm ci`
- `$ npx sls deploy`

To run unit tests:
  - `$ npm t`

To run integration tests:
  - `$ export NODE_ENV=dev`
  - `$ npm run test:int`

To run end-to-end tests:
  - `$ export NODE_ENV=dev`
  - `$ npm run test:e2e`

## Initial Deployment and Spiral Approach to Building
I am including this section because I have received questions about initial deployment. Most of them are similar to "How can I write a test against a DynamoDB when I haven't yet configured it?" and it's a fair question.

When I build a project, I do so in a circular fashion. I start with a small thing, maybe a `hello-world` Lambda, and then I deploy it. Once I have an idea about my data storage needs, I'd likely go back and add a simple DynamoDB definition *and then deploy it*. I'm constantly making incremental progress while integrating and deploying frequently. I visualize this not quite as a circle, but a circle moving forward - a spiral.

This code-base is a snapshot of an imaginary project which has already gone through a few cycles since its inception. When I say "write an integration test that hits DynamoDB and you don't have to deploy first" I am talking about this point on the project's spiral and all future points. 

All that is to re-iterate - when you first clone this project, you will have to deploy it first before you run the `int` tests.

## References
 - [Yan Cui: Yubl's Serverless Testing](https://medium.com/hackernoon/yubls-road-to-serverless-part-2-testing-and-ci-cd-72b2e583fe64)
 - [Yan Cui's AppSync Masterclass: Chapter 4, Lesson 5](https://theburningmonk.thinkific.com/courses/take/appsync-masterclass-premium/lessons/17643894-what-should-we-test)
 - [Paul Swail: Integration & E2E Tests](https://serverlessfirst.com/integration-e-2-e-tests/)
 - [Spotify R&D](https://engineering.atspotify.com/2018/01/11/testing-of-microservices/)
 - [Mocks & Stubs (Imagine a world w/o mocks)](https://www.youtube.com/watch?v=EaxDl5NPuCA)

## Footnotes
<a name="foot01">1</a>: One place mocks are useful is to simulate hard-to-generate responses from systems like AWS. For example, you may want to cover the case where you handle a Provisioned Throughput Exceeded Exception from DynamoDB. This would be cumbersome to actually generate via AWS, so using a mocked DynamoDB client to generate the response is appropriate.

<a name="foot02">2</a>: By "stable", I mean a service that is always available. E.g., AWS, Stripe, or Algolia. Examples of unstable services include most of the services your team deploys

<a name="foot03">3</a>: Many of these integration tests require infrastructure that does require an initial "deployment" but can be tested in a later pass. E.g., I may provision a DDB table up front, deploy it, and then write my repository module with all its integration tests that use the DB.

<a name="foot04">4</a>: Tests that use existing endpoints to verify (and sometimes to clean up) can often be run in higher environments - even in Production. I have sometimes categorized these as "smoke" tests. These smoke tests could potentially run on a timer - every N minutes - and raise alerts to the team if they ever fail.