const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JWTstrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
const User = require('../models/User')

const formFields = {
    usernameField: 'email',
    passwordField: 'password'
}

// Login strategy
passport.use(new LocalStrategy(formFields, async (email, password, done) => {
    try {
        const user = await User.findOne({ email: email })
        if (!user) {
            return done(null, false, { error: 'Could not find user.' })
        } else {
            // Validate password
            const validPass = await user.validPassword(password, user.password)
            if (!validPass) {
                return done(null, false, { error: 'Invalid password.' })
            } else {
                return done(null, user, { message: 'Successfully logged in.' })
            }
        }
    } catch (err) {
        return done(err)
    }
}))

// JWT verification strategies
// All users
passport.use('user', new JWTstrategy(
    {
        secretOrKey: process.env.TOKEN_SECRET,
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken('token')
    },
    async (token, done) => {
        try {
            return done(null, token.user)
        } catch (err) {
            done(err)
        }
    }
))

// Teachers only
passport.use('teacher', new JWTstrategy(
    {
        secretOrKey: process.env.TOKEN_SECRET,
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken('token')
    },
    async (token, done) => {
        try {
            if (token.user.role === 'teacher') {
                return done(null, token.user)
            } else {
                return done(null, false)
            }
        } catch (err) {
            done(err)
        }
    }
))