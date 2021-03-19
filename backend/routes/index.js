//api
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.status(418).send({ teapot: '☕' })
})

module.exports = router