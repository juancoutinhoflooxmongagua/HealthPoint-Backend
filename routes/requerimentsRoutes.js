const express = require('express');
const db = require('../config/db');
const { verifyTokenAdmin } = require('../middlewares/auth');
const router = express.Router();

router.post('/request', async (req, res) => {
  const { hospital_name, hospital_address, hospital_phone, hospital_email, hospital_password } = req.body;

  if (!hospital_name || !hospital_address || !hospital_phone || !hospital_email || !hospital_password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    const [check] = await db.execute(
      'SELECT * FROM hospital_requests WHERE hospital_email = ? AND status = "pending"',
      [hospital_email]
    );
    if (check.length > 0) {
      return res.status(400).json({ error: 'Já existe um pedido pendente com este e-mail' });
    }

    await db.execute(
      `INSERT INTO hospital_requests (hospital_name, hospital_address, hospital_phone, hospital_email, hospital_password)
       VALUES (?, ?, ?, ?, ?)`,
      [hospital_name, hospital_address, hospital_phone, hospital_email, hospital_password]
    );

    res.status(201).json({ message: 'Requerimento enviado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno' });
  }
});

router.get('/requests', verifyTokenAdmin, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM hospital_requests');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno' });
  }
});

router.put('/requests/:id/status', verifyTokenAdmin, async (req, res) => {
  const requestId = req.params.id;
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Status inválido' });
  }

  try {
    const [requestRows] = await db.execute(
      'SELECT * FROM hospital_requests WHERE request_id = ?',
      [requestId]
    );

    if (requestRows.length === 0) {
      return res.status(404).json({ error: 'Requerimento não encontrado' });
    }

    const request = requestRows[0];

    if (status === 'approved') {
      await db.execute(
        `INSERT INTO Hospitals (hospital_name, hospital_address, hospital_phone, hospital_password)
         VALUES (?, ?, ?, ?)`,
        [request.hospital_name, request.hospital_address, request.hospital_phone, request.hospital_password]
      );
    }

    await db.execute(
      `UPDATE hospital_requests SET status = ?, decision_at = NOW() WHERE request_id = ?`,
      [status, requestId]
    );

    res.json({ message: `Requerimento ${status} com sucesso` });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno' });
  }
});

module.exports = router;
