// app.js
require('dotenv').config()

const express = require('express')
const app = express()
const userRoutes = require('../routes/userRoutes')
const authRoutes = require('../routes/authRoutes')

app.use(express.json())

app.use('/', userRoutes)
app.use('/', authRoutes)

module.exports = app
