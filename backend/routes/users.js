//api/users
const express = require('express')
const router = express.Router()
const routes = require('./routes')
const passport = require('passport')

// ----- GET -----
// Get group of users (either all or those who match query)
router.get('/', passport.authenticate('user', { session: false }), routes.getUsers)

// Get specific user (by e-mail as unique identifier)
router.get('/:email', passport.authenticate('user', { session: false }), routes.getByEmail)


// ----- POST -----
// Create new user
router.post('/new', routes.createUser)

// Log in user
router.post('/login', routes.loginUser)


// ----- PUT -----
// Update user details
router.put('/:email/update', passport.authenticate('teacher', { session: false }), routes.updateUserDetails)

// Create new temporary password
router.put('/:email/reset-password', routes.createTempPass)


// ----- DELETE -----
// Delete specific user
router.delete('/:email/delete', passport.authenticate('teacher', { session: false }), routes.deleteUser)


module.exports = router