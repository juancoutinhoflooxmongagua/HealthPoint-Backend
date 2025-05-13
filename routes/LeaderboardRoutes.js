const express = require('express');
const db = require('../config/db');
const { verifyToken, isAdmin } = require('../middlewares/auth');

const router = express.Router();

router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        u.user_id,
        u.user_name,
        SUM(a.points_awarded) AS total_points
      FROM applications a
      JOIN Users u ON a.volunteer_id = u.user_id
      WHERE a.application_status = 'approved'
      GROUP BY u.user_id
      ORDER BY total_points DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter leaderboard' });
  }
});

module.exports = router;
