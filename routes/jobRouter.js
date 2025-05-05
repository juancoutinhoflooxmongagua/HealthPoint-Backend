const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { verifyToken, isAdmin } = require('../middlewares/auth');
const router = express.Router();
const JobController = require('../controller/JobController');

router.post('/', verifyToken, JobController.create);
router.get('/', verifyToken, JobController.list);
router.delete('/:id', verifyToken, JobController.remove);
router.put('/:id', verifyToken, JobController.update);

module.exports = router