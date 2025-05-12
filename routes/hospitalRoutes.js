const express = require('express');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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

router.get('/profile/:hospital_id', async (req, res) => {
  try {
    const { hospital_id } = req.params;

    const [rows] = await db.execute(
      "SELECT hospital_name, hospital_id, hospital_address, hospital_phone FROM Hospitals WHERE hospital_id = ?",
      [hospital_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: `Hospital com ID ${hospital_id} não encontrado` });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter perfil do hospital' });
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
      return res.status(404).json({ error: `Hospital com ID ${id} não encontrado` });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter dados do hospital' });
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

    const isPasswordValid = await bcrypt.compare(hospital_password, hospital.hospital_password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const token = jwt.sign(
      { hospital_id: hospital.hospital_id, hospital_name: hospital.hospital_name },
      'seu-segredo-aqui',
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login bem-sucedido', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

module.exports = router;
