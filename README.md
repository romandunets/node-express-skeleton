# Node + Express REST API skeleton
This project is a skeleton for Node + Express REST API. It can be used as a starting point for Node REST API or just as an example how to use Express framework.

The repository contains a sample Express REST API which is preconfigured to install all the dependencies for instant development. The application has very simple business logic showing how to implement basic operations with user model. The main purpose of this project is to demonstrate how to organize your Express project.

## Features
The whole functionality of this project is built around two entities: users and items. Every user can have his own items. Every authorized user can manage his own set of items using the full set of CRUD operations. Unathorized user can only create a new user account.

This project demonstrates how to:
 * Implement CRUD pattern in REST API
 * Organize project directory structure
 * Organize routing for large applications
 * Set up JWT authentification for private routes
 * Encrypt user passowrd in database
 * Manage and check user rights
 * Manage multi-environment configuration
 * Implement integration tests with fixtures
 * Implement pagination for lists
 * Implement sorting for lists
 * Implement filtering for lists
 * Handle CORS problem for development environment

## Getting started

### Prerequisites
You need to have a git client to clone the repository. You can get it from http://git-scm.com/.

Also you must to have node.js and npm (node.js package manager). You can get them from http://nodejs.org/.

### Development environment

Clone the `node-express-skeleton` repository using [git](git):

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

### Development database
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

### Tests

Run tests:

```
npm test
```

## References
 * [Best practices for Express app structure](https://www.terlici.com/2014/08/25/best-practices-express-structure.html)
 * [User Authentication using JWT (JSON Web Token) in Node.js (Express Framework)](https://medium.com/@pandeysoni/user-authentication-using-jwt-json-web-token-in-node-js-using-express-framework-543151a38ea1)
 * [Authenticate a Node.js API with JSON Web Tokens](https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens)
 * [https://www.codementor.io/olatundegaruba/5-steps-to-authenticating-node-js-with-jwt-7ahb5dmyr](https://www.codementor.io/olatundegaruba/5-steps-to-authenticating-node-js-with-jwt-7ahb5dmyr)
 * [Route Middleware to Check if a User is Authenticated in Node.js](https://scotch.io/quick-tips/route-middleware-to-check-if-a-user-is-authenticated-in-node-js)
 * [Keeping API Routing Clean Using Express Routers](https://scotch.io/tutorials/keeping-api-routing-clean-using-express-routers)