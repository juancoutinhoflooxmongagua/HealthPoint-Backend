const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Hospitals');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao listar hospitais' });
  }
});

router.get('/jobs-with-applications', verifyToken, async (req, res) => {
  try {
    const hospital_id = req.user.hospital_id;

    const [jobs] = await db.execute(
      `SELECT * FROM jobs WHERE hospital_id = ?`,
      [hospital_id]
    );

    for (const job of jobs) {
      const [applications] = await db.execute(
        `SELECT 
           a.application_id, a.volunteer_id, a.application_status, a.points_awarded, a.applied_at,
           u.user_name AS user_name, u.user_email AS user_email
         FROM applications a
         JOIN Users u ON a.volunteer_id = u.user_id
         WHERE a.job_id = ?`,
        [job.job_id]
      );
      job.applications = applications;
    }

    res.json(jobs);
  } catch (err) {
    console.error('Erro ao buscar vagas com candidaturas:', err);
    res.status(500).json({ error: 'Erro ao buscar vagas e candidatos' });
  }
});

router.put('/:id/status', verifyToken, async (req, res) => {
  const applicationId = req.params.id;
  let { status } = req.body;

  if (status === 'aceita') {
    status = 'approved';
  } else if (status === 'rejeitada') {
    status = 'rejected';
  }

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ error: 'Status inválido' });
  }

  try {
    const [result] = await db.execute(`UPDATE applications SET application_status = ? WHERE application_id = ?`,
      [status, applicationId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Candidatura não encontrada' });
    }

    if (status === 'approved') {
      const [rows] = await db.execute(
        `SELECT a.volunteer_id, u.user_name 
         FROM applications a
         JOIN Users u ON a.volunteer_id = u.user_id
         WHERE a.application_id = ?`,
        [applicationId]
      );

      if (rows.length > 0) {
        const { volunteer_id, user_name } = rows[0];

        const title = 'Candidatura aprovada';
        const message = `Parabéns, ${user_name}! Sua candidatura foi aprovada.`;

        await db.execute(
          `INSERT INTO notifications_users (user_id, title, message) VALUES (?, ?, ?)`,
          [volunteer_id, title, message]
        );
      }
    }

    res.json({ message: 'Status atualizado com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar status da candidatura:', err);
    res.status(500).json({ error: 'Erro ao atualizar status da candidatura' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { hospital_name, hospital_address, hospital_phone, hospital_password } = req.body;

    if (!hospital_name || !hospital_address || !hospital_phone || !hospital_password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const [result] = await db.execute(
      'INSERT INTO Hospitals (hospital_name, hospital_address, hospital_phone, hospital_password) VALUES (?, ?, ?, ?)',
      [hospital_name, hospital_address, hospital_phone, hospital_password]
    );

    res.status(201).json({ message: 'Hospital cadastrado', hospital_id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao cadastrar hospital' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { hospital_id, hospital_password } = req.body;

    if (!hospital_id || !hospital_password) {
      return res.status(400).json({ error: 'ID e senha do hospital são obrigatórios' });
    }

    const [rows] = await db.execute(
      "SELECT * FROM Hospitals WHERE hospital_id = ?",
      [hospital_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Hospital não encontrado' });
    }

    const hospital = rows[0];

    if (hospital.hospital_password !== hospital_password) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const token = jwt.sign(
      { hospital_id: hospital.hospital_id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login bem-sucedido', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

router.get('/profile', verifyToken, async (req, res) => {
  try {
    const hospital_id = req.user.hospital_id;

    if (!hospital_id) {
      console.error('hospital_id indefinido em req.user');
      return res.status(400).json({ error: 'ID do hospital inválido no token' });
    }

    const [rows] = await db.execute(
      `SELECT hospital_name, hospital_id, hospital_address, hospital_phone FROM Hospitals WHERE hospital_id = ?`,
      [hospital_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Hospital não encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Erro interno em GET /hospital/profile:', err.stack || err);
    res.status(500).json({ error: 'Erro interno ao obter perfil do hospital' });
  }
});

module.exports = router;
