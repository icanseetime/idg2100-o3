if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')

// Routers
const apiRouter = require('./routes/index')
const userRouter = require('./routes/user')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.on('open', () => console.log('Connected to NTNU database'))

// Routes
app.use('/api', apiRouter)
app.use('/api/users', userRouter)

// Server
app.listen(process.env.PORT || 5000, () => console.log(`Server listening on port ${process.env.PORT || 5000}...`))