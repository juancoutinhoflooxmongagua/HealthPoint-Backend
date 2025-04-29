// app.js
require('dotenv').config()

const express = require('express')
const app = express()
const userRoutes = require('../routes/userRoutes')
const authRoutes = require('../routes/authRoutes')

app.use(express.json())

app.use('/users', userRoutes)
app.use('/register', authRoutes)

module.exports = app
