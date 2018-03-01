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

In order to work with database, you should ave installed mongodb. Instructions on installation can be found here: https://docs.mongodb.com/manual/installation/.

### Development environment

Clone the `node-express-skeleton` repository using git:

```
git clone https://github.com/romandunets/node-express-skeleton
```

Next, you need to install packages and run the application. There are two options to do that.

#### Running local development environment

Install dependencies:

```
npm install
```

Run the application:
```
npm start
```

Note: make sure that mongo db is up and running on your machines.

#### Running docker-compose development environment

You should have Docker and Docker-Compose on your machine to run the following commands. Build and start docker-compose containers:

```
docker-compose up
```

Container uses local directory as a volume, hence it supports hot reload for changes in the node code. For more information look at `docker-compose.yml`.

This command will remove node modules and re-install them for container. This might cause troubles in running it later on OSX. Simply remove node_modules directory and run `npm install` again.

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

## API endpoints
This table contains the endpoints the API supports:

URL | Method | Data example | Description | Query parameters | Response codes
--- | --- | --- | --- | --- | ---
/ | GET | | ping endpoint | | 200 - OK
/authenticate/ | POST | { email: "test@mail.com", password: "password" } | authenticate user | | 200 - Token created, 401 - Authentication failed
/users/ | GET | | list all users | Pagination: `?page=1&pageSize=10`, Sorting ascending: `sort=email`, Sorting descending: `sort=-email`, Multiple sortings: `sort=email,-role`, Filtering: `?email=test@mail.com`, `?role=user` | 200 - Returns list of users, 401 - Authentication failed, 403 - Wrong user rights
/users/ | POST | { email: "test@mail.com", password: "password" } | create new user | | 201 - Returns created user details, 400 - Validation failed
/users/:userId/ | GET | | get user data details | | 200 - Returns user details, 401 - Authentication failed, 403 - Wrong user rights, 404 - User not found
/users/:userId/ | PUT | { email: "test@mail.com", password: "password" } | update user data details | | 200 - Returns updated user details, 400 - Validation failed, 401 - Authentication failed, 403 - Wrong user rights, 404 - User not found
/users/:userId/ | DELETE | | delete user | | 200 - OK, 401 - Authentication failed, 403 - Wrong user rights, 404 - User not found
/users/:userId/items/ | GET | | list all items |  Pagination: `?page=1&pageSize=10`, Sorting ascending: `sort=name`, Sorting descending: `sort=-name`, Filtering: `?name=test` | 200 - Returns list of items, 401 - Authentication failed, 403 - Wrong user rights
/users/:userId/items/ | POST | { name: "test" } | create new item for user | | 201 - Returns created item details, 400 - Validation failed
/users/:userId/items/:id/ | GET | | get item data details | | 200 - Returns item details, 401 - Authentication failed, 403 - Wrong user rights, 404 - Item not found
/users/:userId/items/:id/ | PUT | { name: "test" } | update item data details | | 200 - Returns updated item details, 400 - Validation failed, 401 - Authentication failed, 403 - Wrong user rights, 404 - Item not found
/users/:userId/items/:id/ | DELETE | | delete item | | 200 - OK, 401 - Authentication failed, 403 - Wrong user rights, 404 - User not found

## References
 * [Best Practices for Designing a Pragmatic RESTful API](http://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api#pagination)
 * [Best practices for Express app structure](https://www.terlici.com/2014/08/25/best-practices-express-structure.html)
 * [User Authentication using JWT (JSON Web Token) in Node.js (Express Framework)](https://medium.com/@pandeysoni/user-authentication-using-jwt-json-web-token-in-node-js-using-express-framework-543151a38ea1)
 * [Authenticate a Node.js API with JSON Web Tokens](https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens)
 * [5 Steps to Authenticating Node.js with JWT](https://www.codementor.io/olatundegaruba/5-steps-to-authenticating-node-js-with-jwt-7ahb5dmyr)
 * [Route Middleware to Check if a User is Authenticated in Node.js](https://scotch.io/quick-tips/route-middleware-to-check-if-a-user-is-authenticated-in-node-js)
 * [Keeping API Routing Clean Using Express Routers](https://scotch.io/tutorials/keeping-api-routing-clean-using-express-routers)