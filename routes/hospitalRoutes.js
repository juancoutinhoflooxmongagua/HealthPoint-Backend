const express = require('express');
const db = require('../config/db');

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

router.post('/', async (req, res) => {
  try {
    const { hospital_name, hospital_address, hospital_phone } = req.body;

    if (!hospital_name || !hospital_address || !hospital_phone) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const [result] = await db.execute(
      'INSERT INTO Hospitals (hospital_name, hospital_address, hospital_phone) VALUES (?, ?, ?)',
      [hospital_name, hospital_address, hospital_phone]
    );

    res.status(201).json({ message: 'Hospital cadastrado', hospital_id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao cadastrar hospital' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.execute(
      "SELECT hospital_name, hospital_address, hospital_phone FROM Hospitals WHERE hospital_id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Hospital não encontrado' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter dados do hospital' });
  }
});

module.exports = router;
