const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { verifyToken } = require('../middlewares/auth');

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM patients ')
        res.json(rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'Erro ao listar Pacientes'})
    }
})

router.post('/', async (req, res) => {

})

router.delete('/:id', async (req, res) => {

})

router.put('/:id', async (req, res) =>{

})