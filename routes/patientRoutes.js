const express = require('express');
const db = require('../config/db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM patients');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao listar Pacientes' });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      patient_name,
      cpf,
      birth_date,
      gender,
      email,
      phone,
      address,
      hospital_id,
      family_contact_name,
      family_contact_phone,
      family_contact_relationship
    } = req.body;

    const query = `
      INSERT INTO patients (
        patient_name, cpf, birth_date, gender, email, phone, address, hospital_id,
        family_contact_name, family_contact_phone, family_contact_relationship, register
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    await db.query(query, [
      patient_name,
      cpf,
      birth_date,
      gender,
      email,
      phone,
      address,
      hospital_id,
      family_contact_name,
      family_contact_phone,
      family_contact_relationship
    ]);

    res.status(201).json({ message: 'Paciente cadastrado com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao cadastrar paciente.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM patients WHERE patient_id = ?', [id]);
    res.json({ message: 'Paciente removido com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar paciente.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      patient_name,
      cpf,
      birth_date,
      gender,
      email,
      phone,
      address,
      hospital_id,
      family_contact_name,
      family_contact_phone,
      family_contact_relationship
    } = req.body;

    const query = `
      UPDATE patients SET
        patient_name = ?, cpf = ?, birth_date = ?, gender = ?, email = ?, phone = ?, address = ?,
        hospital_id = ?, family_contact_name = ?, family_contact_phone = ?, family_contact_relationship = ?
      WHERE patient_id = ?
    `;

    await db.query(query, [
      patient_name,
      cpf,
      birth_date,
      gender,
      email,
      phone,
      address,
      hospital_id,
      family_contact_name,
      family_contact_phone,
      family_contact_relationship,
      id
    ]);

    res.json({ message: 'Paciente atualizado com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar paciente.' });
  }
});

module.exports = router;
