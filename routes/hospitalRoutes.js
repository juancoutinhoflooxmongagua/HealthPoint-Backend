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

router.post('/login', async (req, res) => {
  try {
    const { hospital_email, hospital_password } = req.body;

    if (!hospital_email || !hospital_password) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    const [rows] = await db.execute("SELECT * FROM Hospitals WHERE hospital_email = ?", [hospital_email]);

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Hospital não encontrado' });
    }

    const hospital = rows[0];
    const match = await bcrypt.compare(hospital_password, hospital.hospital_password);

    if (!match) {
      return res.status(400).json({ error: 'Senha incorreta' });
    }

    const token = jwt.sign(
      {
        hospital_id: hospital.hospital_id,
        hospital_email: hospital.hospital_email
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login realizado com sucesso',
      hospital_id: hospital.hospital_id,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro no login' });
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
