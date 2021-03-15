const bcrypt = require('bcrypt')

// DB Schemas
const User = require('../models/User')

// POST: Create new user
const createUser = async (req, res) => {
    try {
        // Generate secure password
        const salt = await bcrypt.genSalt()
        const securePass = await bcrypt.hash(req.body.matchingPasswords, salt)

        // Create user
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: securePass,
            role: req.body.role
        })

        // Add location/availability for teachers
        if (req.body.role === 'Teacher') {
            newUser.place = 'home-office'
            newUser.availability = 'busy'
        }

        // Save to DB & send response to client-side
        await newUser.save()
        let answer = { redirect: '/login' }
        res.status(201).json(answer)
    } catch (err) {
        res.status(500).json(`There was an error adding ${req.body.email} to the database. \n ${err} \n ${req}`)
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
        let users = await User.find({ role: 'Teacher' })
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
    createUser,
    findUser,
    validateUser,
    getTeachers
}