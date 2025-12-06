const db = require('../config/db');

const Task = {
  getTasksByCategory: (userId, category, callback) => {
    let sql = 'SELECT * FROM tasks WHERE user_id = ?';
    const params = [userId];

    if (category !== 'All') {
      sql += ' AND category = ?';
      params.push(category);
    }

    db.query(sql, params, callback);
  },

  addTask: (userId, title, category, date, notes, callback) => {
    const sql = 'INSERT INTO tasks (user_id, title, category, due_date, notes) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [userId, title, category, date, notes], callback);
  },

  completeTask: (taskId, callback) => {
    const sql = 'UPDATE tasks SET completed = true WHERE id = ?';
    db.query(sql, [taskId], callback);
  }
};

module.exports = Task;
