const express = require('express');
const router = express.Router();
const db = require('../config/db')

const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

router.get('/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await db.query("SELECT user_id, user_name, user_email, user_role FROM users");
    res.json(users.rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

module.exports = router;
