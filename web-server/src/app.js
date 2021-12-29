require('dotenv').config()

const { HTTP_PORT } = require("./constants");
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()

app.use(bodyParser.json())
app.use(cors({
    origin: '*',
}))

app.post('/owners/:address/authorize', require('./controllers/AuthorizeController').store)
app.get('/owners/:address/inventory', require('./controllers/InventoryController').show)

module.exports = app