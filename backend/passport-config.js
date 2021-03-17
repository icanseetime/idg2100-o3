// Sett dette hvor det skal brukes
// const passport = require('passport')
// const initializePassport = require('./passport-config')

const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt')

function initialize(passport) {
    passport.use(new LocalStrategy({
        usernameField: 'email'
        // passwordField: 'password'
    }),
        authenticateUser)
    passport.serializeUser((user, done) => { })
    passport.deserializeUser((id, done) => { })
}

function authenticateUser(email, password, done) {
    const user = getUserByEmail(email)
    if (!user) {
        return done(null, false, { errorMessage: 'No user with that e-mail.' })
    }
}