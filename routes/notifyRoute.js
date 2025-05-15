const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

router.post('/notifications/users', async (req, res) => {
  const { user_id, title, message } = req.body;
  try {
    await db.query(
      'INSERT INTO notifications_users (user_id, title, message) VALUES (?, ?, ?)',
      [user_id, title, message]
    );
    res.status(201).json({ message: 'Notificação criada para usuário' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/notifications/users/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const [notifications] = await db.query(
      'SELECT * FROM notifications_users WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/notifications/users/:id/read', async (req, res) => {
  const id = req.params.id;
  try {
    await db.query(
      'UPDATE notifications_users SET is_read = TRUE WHERE notification_id = ?',
      [id]
    );
    res.json({ message: 'Notificação marcada como lida' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/notifications/hospitals', async (req, res) => {
  const { hospital_id, title, message } = req.body;
  try {
    await db.query(
      'INSERT INTO notifications_hospitals (hospital_id, title, message) VALUES (?, ?, ?)',
      [hospital_id, title, message]
    );
    res.status(201).json({ message: 'Notificação criada para hospital' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/notifications/hospitals/:hospitalId', async (req, res) => {
  const hospitalId = req.params.hospitalId;
  try {
    const [notifications] = await db.query(
      'SELECT * FROM notifications_hospitals WHERE hospital_id = ? ORDER BY created_at DESC',
      [hospitalId]
    );
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/notifications/hospitals/:id/read', async (req, res) => {
  const id = req.params.id;
  try {
    await db.query(
      'UPDATE notifications_hospitals SET is_read = TRUE WHERE notification_id = ?',
      [id]
    );
    res.json({ message: 'Notificação marcada como lida' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
