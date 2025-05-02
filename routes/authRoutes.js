const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { user_email, user_name, user_password, user_phone } = req.body;

    if (!user_email || !user_name || !user_password || !user_phone) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    const hashedPassword = await bcrypt.hash(user_password, 10);

    const [result] = await db.execute(
      "INSERT INTO users (user_email, user_password, user_name, user_phone, user_role) VALUES (?, ?, ?, ?, ?)",
      [user_email, hashedPassword, user_name, user_phone, 'volunteer'] // padrão
    );

    const token = jwt.sign(
      { user_id: result.insertId, user_email, user_role: 'volunteer' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      user_id: result.insertId,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro no registro' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { user_email, user_password } = req.body;

    if (!user_email || !user_password) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    const [rows] = await db.execute("SELECT * FROM users WHERE user_email = ?", [user_email]);

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(user_password, user.user_password);

    if (!match) {
      return res.status(400).json({ error: 'Senha incorreta' });
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        user_email: user.user_email,
        user_role: user.user_role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login realizado com sucesso',
      user_id: user.user_id,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro no login' });
  }
});

module.exports = router;
