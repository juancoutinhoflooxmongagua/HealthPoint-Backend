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
        COALESCE(SUM(a.points_awarded), 0) AS total_points
      FROM Users u
      LEFT JOIN applications a ON a.volunteer_id = u.user_id
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
