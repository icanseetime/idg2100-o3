//api/users
const express = require('express')
const router = express.Router()
const routes = require('./routes')

// ----- GET -----

// Get all users
router.get('/', routes.getAllUsers)

// Get users by specific role
router.get('/:role', routes.getByRole)

// Get list of all teachers
router.get('/teachers', routes.getTeachers) //TODO: rewrite to pick from specific role

// "Get new password"
router.get('/reset-password', routes.findUser)


// ----- POST -----
// Create new user
router.post('/new', routes.createUser)

// Log in user
router.post('/login', routes.validateUser)


// ----- PUT -----



// ----- DELETE -----



module.exports = router