// Packages
const bcrypt = require('bcrypt')
const generator = require('generate-password')
const passport = require('passport')
const jwt = require('jsonwebtoken')

// DB Schemas
const User = require('../models/User')

const getUsers = async (req, res) => {
    try {
        const users = await User.find(req.query)
        if (users.length) {
            res.status(200).json(users)
        } else {
            res.status(404).json({ error: 'Could not find any users.' })
        }
    } catch (error) {
        res.status(500).json(`Something went wrong while trying to find users.`)
    }
}

const getByEmail = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email })
        if (user) {
            res.status(200).json(user)
        } else {
            res.status(404).json({ error: 'User not found.' })
        }
    } catch (err) {
        res.status(500).json({ error: `Something went wrong while looking for user with email ${req.params.email}.` })
    }
}

// POST: Create new user
const createUser = async (req, res) => {
    try {
        // Check that user e-mail does not exist in DB
        let existingUser = await User.findOne({ email: req.body.email })
        if (existingUser) {
            res.status(409).json({ error: 'User with this email already exists in the database.' })
        }

        // Create user object
        const newUser = new User({
            name: req.body.name.trim(),
            surname: req.body.surname.trim(),
            email: req.body.email.trim(),
            password: req.body.password.trim(),
            role: req.body.role.trim()
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

// // GET: Log in user
const loginUser = async (req, res, next) => {
    console.log(req.body)
    passport.authenticate('local', async (err, user, info) => {
        console.log(err, user, info)
        try {
            if (err || !user) {
                const error = err ? new Error(err) : new Error(info.error)
                return next(error)
            } else {
                req.login(user, { session: false }, async (error) => {
                    if (error) {
                        return next(error)
                    }

                    // Generate and return JWT
                    const body = { _id: user._id, email: user.email, role: user.role }
                    const token = jwt.sign({ user: body }, process.env.TOKEN_SECRET)
                    return res.json({ token })
                })
            }
        } catch (error) {
            res.status(500).json(err)
        }
    })(req, res, next)
}

const updateUserDetails = async (req, res) => {
    try {
        // Make sure request doesn't include password
        if (!req.body.password) {
            // Update user and get response
            const user = await User.updateOne({ email: req.params.email }, req.body)
            // Check for found/updated user and send response to client
            if (!user.n) {
                res.status(404).json({ error: `Could not find a user with the e-mail address ${req.params.email}.` })
            } else if (!user.nModified) {
                res.status(409).json({ error: `Could not modify user with e-mail address ${req.params.email}. Please check update values and try again.` })
            } else {
                res.status(201).json({ message: `User with e-mail ${req.params.email} was successfully updated.` })
            }
        } else {
            res.status(403).json({ error: `You should not include user passwords in your request. These can only be changed by the users themselves.` })
        }
    } catch (err) {
        res.status(500).json({ error: `Something went wrong while trying to update the user: ${err}` })
    }
}

const createTempPass = async (req, res) => {
    try {
        // Check if user exists
        let user = await User.findOne({ email: req.params.email })
        if (user) {
            // Generate random temporary password
            const newPass = generator.generate({
                length: 8,
                numbers: true
            })
            user.password = newPass
            await user.save()
            res.status(201).json({ message: `Your new password is ${newPass}. Please log in and change the password immediately.` })
        } else {
            res.status(400).json({ error: `Couldn't find user with this e-mail address.` })
        }
    } catch (err) {
        res.status(500).json({ message: `Something went wrong while trying to reset the password.` })
    }
}

const deleteUser = async (req, res) => {
    try {
        // Check that user e-mail does not exist in DB
        let existingUser = await User.findOne({ email: req.params.email })
        if (existingUser) {
            await User.deleteOne({ email: req.params.email })
            res.status(200).json({ message: `User with e-mail ${req.params.email} deleted successfully.` })
        } else {
            res.status(404).json({ error: 'There is no user with this e-mail in the database.' })
        }
    } catch (err) {
        res.status(500).json({ error: `Something went wrong while trying to delete the user.` })
    }
}

module.exports = {
    getUsers,
    getByEmail,
    createUser,
    loginUser,
    updateUserDetails,
    createTempPass,
    deleteUser
}