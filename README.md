# Oblig 3 🕳🐇

## Content

1. [How to run and test project](#how-to-run-and-test-project)
    - [Run](#run)
    - [Test](#test)
2. [Information about API](#information-about-api)
    - [Technologies used](#technologies-used)
    - [Endpoints](#endpoints)
    - [File structure](#file-structure)
    - [Notes](#notes)

---

## How to run and test project

### Run

1. Run `npm install` or `yarn install` from **the backend folder** to install all packages
2. Create a new collection in MongoDB and import data from the [mongodb.json](./extra/mongodb.json) file
3. Find the [.env](./backend/.env) file and replace the _DATABASE_URL_ local DB string with your own MongoDB connection string
4. Run `npm run devstart` or `yarn devstart` from **the backend folder** to start the server with nodemon

### Test

1. Import collection from the [postman.json](./extra/postman.json) file into Postman
2. Run all requests in collection - preferrably in order
3. Requests marked with 🔑 requires a JWT in the form of a Bearer token from any authorized user in the Authorization tab
4. Requests marked with 👨‍🏫 requires a JWT from an authorized user with teacher role

\*_Feel free to also run your own tests, I didn't include every possible option._

---

## Information about API

### Technologies used

| Package name      | Usage                                                |
| ----------------- | ---------------------------------------------------- |
| express           | Framework                                            |
| mongoose          | DB connection                                        |
| passport          | Main package for authentication                      |
| passport-local    | Login authentication                                 |
| passport-jwt      | User / role-based authentication on routes           |
| jsonwebtoken      | User / role-based authentication on routes           |
| bcrypt            | Password encryption                                  |
| cors              | CORS, so API stays independent of frontend           |
| generate-password | Generating random passwords for reset-password route |
| dotenv            | Environment variables                                |
| nodemon           | Automatic refresh of server                          |

---

### Endpoints

| Method | Endpoint                   | Functionality                                                                | Access               |
| ------ | -------------------------- | ---------------------------------------------------------------------------- | -------------------- |
| GET    | /api                       | Top level of API, no specific functionality [\*](#comments)                  | No auth              |
| GET    | /api/users                 | User collection, search for all users or collections of users based on query | All authorized users |
| GET    | /api/users/:email          | Find information about specific user by their e-mail                         | All authorized users |
| PUT    | /api/users/:email          | Update any user details (except password)                                    | Teachers             |
| PUT    | /api/users/:email/password | Set temporary password in DB and retrieve it in plain-text [\*\*](#comments) | No auth              |
| DELETE | /api/users/:email          | Delete specific user by e-mail                                               | Teachers             |
| POST   | /api/users/new             | Register new user                                                            | No auth              |
| POST   | /api/users/login           | Log in user, get JWT back                                                    | No auth              |

---

#### Comments

_\*I chose to have a top level /api and a sublevel /users, so that it would be possible to add other "collections" to the API later_

_\*\* Definitely not an optimal solution to send temporary passwords in plain-text, in a real app the customer would probably be sent an e-mail where they could reset their password. But for the sake of having some sort of functionality for the "Forgot password"-section of the front-end, I decided to do it this way._

---

### File structure

| Content                                      | Link(s)                                 |
| -------------------------------------------- | --------------------------------------- |
| Server setup                                 | [server.js](./backend/server.js)        |
| Top-level API endpoint                       | [index.js](./backend/routes/index.js)   |
| Users collection endpoint (w/ authorization) | [users.js](./backend/routes/users.js)   |
| Routes (where the magic happens)             | [routes.js](./backend/routes/routes.js) |
| Passport authorization setup                 | [auth.js](./backend/auth/auth.js)       |
| Database schema and password validation      | [User.js](./backend/models/User.js)     |
| Environment variables                        | [.env](./backend/.env)                  |

---

### Notes

-   I have CORS installed and set up, because I realized I needed it when I set up the backend for Oblig 2. It's not necessary for this task, but for the sake of the "API remaining completely independent" I decided to leave it there.
-   I've used the users :email instead of :\_id as identifiers on the endpoints, because it seemed easier to deal with for the client-side. In hindsight, when I realized the users should not have access to other users e-mail, it might not have been the best idea. I've left it as is, and I included both in the JWT, just in case.
-   I chose not to create separate files for the routes that teachers have access to, all users have access to etc. I kept them in the same file since the endpoints are so similar, and I wanted to keep all /users routes in the same file. Instead, I used 2 different JWT strategies, and used them as middleware on the appropriate routes.
-   There is almost no validation of passwords (like min 1 letter and 1 number) or checking of e-mail being a proper e-mail etc. I did that on the client-side in oblig2, so I made an assumption that it wasn't necessary.

---

🍰 [Back to top](#oblig-3-🕳🐇) 
