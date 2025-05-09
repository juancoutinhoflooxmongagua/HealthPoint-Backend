const express = require('express');
const { verifyToken } = require('../middlewares/auth');
const router = express.Router();
const JobController = require('../controller/JobController');

router.post('/create', verifyToken, JobController.create); 
router.get('/', JobController.list); 
router.delete('/:id', verifyToken, JobController.remove); 
router.put('/:id', verifyToken, JobController.update); 

module.exports = router;
