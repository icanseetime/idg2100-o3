//api
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.status(418).send({ tea: '☕', quote: `'Have some wine,' the March Hare said in an encouraging tone. Alice looked around the table, but there was nothing on it but tea. 'I don't see any wine,' she remarked. 'There isn't any,' said the March Hare.` })
})

module.exports = router