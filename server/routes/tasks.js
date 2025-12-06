const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all tasks for a user
router.get('/:userId', (req, res) => {
  const userId = req.params.userId;
  db.query(
    'SELECT * FROM tasks WHERE user_id = ? ORDER BY due_date ASC',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
});

// Add a new task
router.post('/', (req, res) => {
  const { user_id, title, category, notes, due_date } = req.body;

  if (!user_id || !title || !category || !due_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.query(
    'INSERT INTO tasks (user_id, title, category, notes, due_date) VALUES (?, ?, ?, ?, ?)',
    [user_id, title, category, notes || null, due_date],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.sqlMessage || err });
      res.json({ message: 'Task added successfully', taskId: result.insertId });
    }
  );
});

// Mark task as complete
router.put('/complete/:taskId', (req, res) => {
  const taskId = req.params.taskId;
  db.query(
    'UPDATE tasks SET completed = TRUE WHERE id = ?',
    [taskId],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Task marked as complete' });
    }
  );
});

// ✅ Mark task as incomplete
router.put('/uncomplete/:id', async (req, res) => {
  try {
    const [result] = await db.query('UPDATE tasks SET completed = 0 WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to unmark task' });
  }
});

module.exports = router;
