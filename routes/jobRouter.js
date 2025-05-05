const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { verifyToken, isAdmin } = require('../middlewares/auth');

const router = express.Router();

// CREATE
router.post('/', verifyToken, (req, res) => {
})

//READ
router.get('/', verifyToken, (req, res) => {

})

// DELETE 

router.delete('/:id', verifyToken, (req, res) => {

})

// UPDATE
router.put('/:id', verifyToken, (req, res) => {

})

module.exports = router;
