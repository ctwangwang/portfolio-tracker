require('dotenv').config();
const express = require('express');
const path = require('path');
const portfolioRoutes = require('./routes/portfolio');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public')); // Serve static files

// Routes
app.use('/api/portfolio', portfolioRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Portfolio tracker running on http://localhost:${PORT}`);
});