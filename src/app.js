require('dotenv').config()

const express = require('express')
const roues = require('./routes')

const app = express()

app.use(express.json())
app.use(routes)

module.exports = app