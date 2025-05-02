// app.js
require('dotenv').config()

const express = require('express')
const app = express()
const userRoutes = require('../routes/userRoutes')
const authRoutes = require('../routes/authRoutes')
const adminRoutes = require('../routes/adminRoutes')
const cors = require('cors')

app.use(cors({
    origin: 'http://localhost:3000'
  }));
  

app.use(express.json())

app.use('/', userRoutes)
app.use('/auth', authRoutes)
app.use('/admin', adminRoutes);

module.exports = app
