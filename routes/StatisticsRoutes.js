const express = require('express');
const db = require('../config/db');
const { verifyToken, isAdmin } = require('../middlewares/auth');

const router = express.Router();

router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const [userCount] = await db.query('SELECT COUNT(*) AS total_users FROM Users');
    const [hospitalCount] = await db.query('SELECT COUNT(*) AS total_hospitals FROM Hospitals');
    const [jobCount] = await db.query('SELECT COUNT(*) AS total_jobs FROM jobs');
    const [applicationCount] = await db.query('SELECT COUNT(*) AS total_applications FROM applications');

    res.json({
      total_users: userCount[0].total_users,
      total_hospitals: hospitalCount[0].total_hospitals,
      total_jobs: jobCount[0].total_jobs,
      total_applications: applicationCount[0].total_applications
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter estatísticas' });
  }
});

module.exports = router;
