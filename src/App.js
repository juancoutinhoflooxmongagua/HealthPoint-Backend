// app.js
require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json())

app.use(cors({
    origin: 'http://localhost:3000'
}));

// Routes
const userRoutes = require('../routes/userRoutes')
const authRoutes = require('../routes/authRoutes')
const jobRoutes = require('../routes/jobRouter')

app.use('/', userRoutes)
app.use('/jobs', jobRoutes)
app.use('/auth', authRoutes)

module.exports = app
