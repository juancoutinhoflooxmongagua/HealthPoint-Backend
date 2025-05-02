// app.js
require('dotenv').config()

const express = require('express')
const app = express()
const userRoutes = require('../routes/userRoutes')
const authRoutes = require('../routes/authRoutes')
const AdminRoutes = require('../routes/AdminRoutes')
const cors = require('cors')

app.use(cors({
    origin: 'http://localhost:3000'
  }));
  

app.get("/admin/dashboard", authenticateToken, isAdmin, (req, res) => {
  res.json({ message: "Área administrativa"})
})

app.use(express.json())

app.use('/', userRoutes)
app.use('/auth', authRoutes)

module.exports = app
