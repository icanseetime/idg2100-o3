if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const cors = require('cors')

// Routers
const apiRouter = require('./routes/index')
const userRouter = require('./routes/users')

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(passport.initialize())
app.use(cors())

// Database connection
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
const db = mongoose.connection
db.on('error', error => console.error('❌ Mongoose DB connection\n', error))
db.on('open', () => console.log('✅ Mongoose DB connection'))

// Main endpoints
app.use('/api', apiRouter) // Main API endpoint
app.use('/api/users', userRouter) // Users endpoint

// Error handling
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.json({ error: `${err}` })
})

// Server
app.listen(process.env.PORT || 5000, () => console.log(`✅ Server running [👂:${process.env.PORT}]`))