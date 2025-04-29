const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../config/db')

const router = express.Router()

router.post('/register', async (req, res) => {
  try {
    const { user_email, user_name, user_password, user_phone } = req.body

    if (!user_email || !user_name || !user_password || !user_phone) {
      return res.status(400).json({ error: 'Dados incompletos' })
    }

    const hashedPassword = await bcrypt.hash(user_password, 10)

    const [result] = await db.execute(
      "INSERT INTO users (user_email, user_password, user_name, user_phone) VALUES (?, ?, ?, ?)",
      [user_email, hashedPassword, user_name, user_phone]
    )

    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      user_id: result.insertId
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro no registro' })
  }
})

module.exports = router
