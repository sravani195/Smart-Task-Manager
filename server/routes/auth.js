const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Register
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.query(query, [name, email, password], (err) => {
    if (err) return res.status(500).send('Error registering user');
    res.redirect('/'); // after register, go to login
  });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, result) => {
    if (err) return res.status(500).send('Login failed');
    if (result.length === 0) return res.status(401).send('Invalid credentials');
    res.redirect('/dashboard'); // success → dashboard
  });
});

module.exports = router;
