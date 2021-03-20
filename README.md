# Oblig 3

_- Ida M. R. Gjeitsund_

---

## Content

1. [How to run and test project](#how-to-run-and-test-project)
    - [Run](#run)
    - [Test](#test)
2. [API](#api)
    - [Technologies used](#technologies-used)
    - [Endpoints](#endpoints)
    - [File structure](#file-structure)
    - [Notes](#notes)

---

## How to run and test project

### Run

1. Run `npm install` or `yarn install` from the root folder to install all packages
2. Find the [.env](./backend/.env) file and replace the _DATABASE_URL_ local DB string with your own MongoDB connection string
3. Create a new collection in MongoDB and import data from the [mongodb.json](./extra/mongodb.json) file
4. Run `npm run devstart` or `yarn devstart` from root folder to start the server with nodemon

### Test

1. Import data from the [postman.json](./extra/postman.json) file into Postman
2. **Run all requests in collection - in order**
3. Tests marked with 🔑 require you to paste in JWT from any authorized user
4. Tests marked with 👨‍🏫 require you to paste in JWT from an authorized user with teacher role

\*_Feel free to also run your own tests, I didn't include every possible option._

---

## API

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

| Endpoint                         | Functionality                                                                | Access               |
| -------------------------------- | ---------------------------------------------------------------------------- | -------------------- |
| /api                             | Top level of API, no specific functionality [\*](#comments)                  | Unauthorized         |
| /api/users                       | User collection, search for all users or collections of users based on query | All authorized users |
| /api/users/:email                | Find information about specific user by their e-mail                         | All authorized users |
| /api/users/:email/reset-password | Set temporary password in DB and retrieve it in plain-text [\*\*](#comments) | Unauthorized         |
| /api/users/:email/update         | Update any user details (except password)                                    | Teachers             |
| /api/users/:email/delete         | Delete specific user by e-mail                                               | Teachers             |
| /api/users/new                   | Register new user                                                            | Unauthorized         |
| /api/users/login                 | Log in user, get JWT back                                                    | Unauthorized         |

---

#### Comments

_\*I chose to have a top level /api and a sublevel /users, so that it would be possible to add other "collections" later_

_\*\* Not the best solution to send temporary passwords in plain-text, in a real app the customer would probably be sent an e-mail. But for the sake of having some sort of functionality for the "Forgot password"-section of the front-end, I decided to do it this way._

---

### File structure

---

### Notes

-   CORS
-   :email instead of :\_id

---

[Back to top](#oblig-3)
