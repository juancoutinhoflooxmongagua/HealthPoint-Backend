const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); 
const router = express.Router();

router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; 

    if (!token) {
      return res.status(401).json({ error: 'Token de autenticação não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.user_id;

    const [rows] = await db.execute('SELECT * FROM users WHERE user_id = ?', [user_id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(rows[0]); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
});

module.exports = router;
