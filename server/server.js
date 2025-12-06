// server/server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ Serve static assets
// All files in client folder (HTML, images, CSS, JS)
app.use(express.static(path.join(__dirname, '../client')));
// Serve assets separately (optional, ensures CSS/JS works)
app.use('/assets', express.static(path.join(__dirname, '../client/assets')));
app.use('/js', express.static(path.join(__dirname, '../client/assets/js')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Pages
app.get('/', (req, res) => res.sendFile(path.resolve(__dirname, '../client/index.html')));
app.get('/register', (req, res) => res.sendFile(path.resolve(__dirname, '../client/register.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.resolve(__dirname, '../client/dashboard.html')));
app.get('/calendar', (req, res) => res.sendFile(path.resolve(__dirname, '../client/calendar.html')));
app.get('/overview', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/overview.html'));
});

// Catch-all 404 (optional, good for debugging)
app.use((req, res) => {
  res.status(404).send('Page not found');
});


// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
