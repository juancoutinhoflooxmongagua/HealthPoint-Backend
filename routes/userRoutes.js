const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { verifyToken, isAdmin } = require('../middlewares/auth');

const router = express.Router();

router.get('/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Users');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
});

router.get('/profile', verifyToken, async (req, res) => {
  try {
    const { user_id } = req.user;

    const [rows] = await db.execute(
      "SELECT user_name, user_email, user_phone, user_role FROM Users WHERE user_id = ?",
      [user_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter dados do perfil' });
  }
});

module.exports = router;
