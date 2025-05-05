const express = require('express');
const { verifyToken } = require('../middlewares/auth');
const router = express.Router();
const JobController = require('../controller/JobController');

// Rotas de criação, listagem, remoção e atualização de jobs
router.post('/', verifyToken, JobController.create); // Criar job
router.get('/', verifyToken, JobController.list); // Listar jobs
router.delete('/:id', verifyToken, JobController.remove); // Remover job
router.put('/:id', verifyToken, JobController.update); // Atualizar job

module.exports = router;
