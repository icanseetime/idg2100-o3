const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JWTstrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
const User = require('../models/User')

const formFields = {
    usernameField: 'email',
    passwordField: 'password'
}

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

passport.use(new JWTstrategy(
    {
        secretOrKey: process.env.TOKEN_SECRET,
        jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
    },
    async (token, done) => {
        try {
            return done(null, token.user)
        } catch (err) {
            done(err)
        }
    }
))