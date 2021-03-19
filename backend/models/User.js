const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const User = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'teacher'],
        required: true,
    },
    place: {
        type: String,
        enum: ['on-campus', 'home-office'],
        required: false
    },
    status: {
        type: String,
        enum: ['available', 'busy'],
        required: false
    }
})

// Middleware
User.pre('save', async function (next) {
    // Encrypt password before saving to DB
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
})

User.methods.validPassword = async (password) => {
    return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', User)