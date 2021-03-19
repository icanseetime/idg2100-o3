const bcrypt = require('bcrypt')

// DB Schemas
const User = require('../models/User')

// GET : Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json(`Something went wrong while trying to find users.`)
    }
}

const getByRole = async (req, res) => {
    try {
        const users = await User.find({ role: req.params.role.toLowerCase() })
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json(`Something went wrong while trying to find users with role ${req.params.role}`)
    }
}

// POST: Create new user
const createUser = async (req, res) => {
    try {
        // Create user
        const newUser = new User({
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
        })

        // Add location/status for teachers
        if (req.body.role === 'teacher') {
            newUser.place = 'home-office'
            newUser.status = 'busy'
        }

        // Save to DB & send response to client-side
        const user = await newUser.save()
        res.status(201).json({ message: 'New user successfully created.', user: user })
    } catch (err) {
        res.status(500).json({ message: `There was an error adding ${req.body.email} to the database.`, error: `${err}` })
    }
}

// GET: Check if user exists by email
const findUser = async (req, res) => {
    try {
        // Find user by e-mail
        let user = await User.find({ email: req.query.email })
        if (user.length) {
            res.status(200).json({ successMessage: `An e-mail has been sent to ${req.query.email}. Please check your e-mail to reset your password.` })
        } else {
            res.status(400).json({ errorMessage: `We couldn't find a user with the e-mail address ${req.query.email}. Please try again.` })
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

// GET: Log in user
const validateUser = async (req, res) => {
    try {
        // Check if user exists
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            // Check if input password matches encrypted user password
            if (await bcrypt.compare(req.body.password, user.password)) {
                let answer = { localStorage: 'userAuth', redirect: '/user' }
                res.status(200).json(answer)
            } else {
                let answer = { errorMessage: 'Wrong password. Please try again.' }
                res.json(answer)
            }
        } else {
            let answer = { errorMessage: 'Wrong e-mail address and/or password. Please try again.' }
            res.json(answer)
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

// GET: Get list of all users
const getTeachers = async (req, res) => {
    try {
        let users = await User.find({ role: 'teacher' })
        if (users.length) {
            res.status(200).json(users)
        } else {
            res.json({ errorMessage: 'No users found in database.' })
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

module.exports = {
    getAllUsers,
    getByRole,
    createUser,
    findUser,
    validateUser,
    getTeachers
}