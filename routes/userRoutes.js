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

router.post('/apply/:job_id', verifyToken, async (req, res) => {
  const { job_id } = req.params;
  const volunteer_id = req.user.user_id;

  try {
    const [existing] = await db.query(
      'SELECT * FROM applications WHERE job_id = ? AND volunteer_id = ?',
      [job_id, volunteer_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Você já se candidatou a esta vaga.' });
    }

    await db.query(
      'INSERT INTO applications (job_id, volunteer_id) VALUES (?, ?)',
      [job_id, volunteer_id]
    );

    res.status(201).json({ message: 'Candidatura realizada com sucesso!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao aplicar para a vaga.' });
  }
});

module.exports = router;
