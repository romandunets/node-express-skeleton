# Node + Express REST API skeleton
This project is a skeleton for Node + Express REST API. It can be used as a starting point for Node REST API or just as an example how to use Express framework.

The repository contains a sample Express REST API which is preconfigured to install all the dependencies for instant development. The application has very simple business logic showing how to implement basic operations with user model. The main purpose of this project is to demonstrate how to organize your Express project.

This project demonstrates:
 * How to implement CRUD pattern
 * How to organize project directory structure
 * How to organize routing for large applications
 * How to set up JWT authentification for private routes
 * How to encrypt user passowrd in database
 * How to manage and check user rights
 * How to manage multi-environment configuration
 * How to implement integration tests with fixtures
 * How to implement pagination for lists

## Features
Unathorized user can only create a new user account. Every authorized user can manage his own set of items using the full set of CRUD operations.

## Getting started

Clone the `node-express-skeleton` repository using [git][git]:

```
git clone https://github.com/romandunets/node-express-skeleton
```

Install dependencies:

```
npm install
```

Run the application:
```
npm start
```

## Tests

Run tests:

```
npm test
```

## Development database
Development database can be populated using `populatedb` script:
```
npm run populatedb
```
The command will use test fixtures to populate development database with fixtures from `test/fixtures` directory.

To populate some collections only use `mongofixtures`:
```
mongofixtures node-express-skeleton-dev fixtures/users.js
```
This command can be also used to populate the same fixutres to different databases.

## TODO
 * CORS problem
 * Sorting
 * Search

## References
 * https://www.terlici.com/2014/08/25/best-practices-express-structure.html
 * https://medium.com/@pandeysoni/user-authentication-using-jwt-json-web-token-in-node-js-using-express-framework-543151a38ea1
 * https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens
 * https://www.codementor.io/olatundegaruba/5-steps-to-authenticating-node-js-with-jwt-7ahb5dmyr
 * https://scotch.io/quick-tips/route-middleware-to-check-if-a-user-is-authenticated-in-node-js
 * https://scotch.io/tutorials/keeping-api-routing-clean-using-express-routers