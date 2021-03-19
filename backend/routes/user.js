//api/users
const express = require('express')
const router = express.Router()
const routes = require('./routes')

// ----- GET -----

// Get all users
router.get('/', routes.getUsers)

// Get specific user (by e-mail as unique identifier)
router.get('/:email', routes.getByEmail)

// ----- POST -----
// Create new user
router.post('/new', routes.createUser)

// Log in user
// router.post('/login', routes.validateUser)


// ----- PUT -----
// Update user details
router.put('/:email/update', routes.updateUserDetails)

// Create new temporary password
router.put('/:email/reset-password', routes.createTempPass)


// ----- DELETE -----
router.delete('/:email/delete', routes.deleteUser)


module.exports = router