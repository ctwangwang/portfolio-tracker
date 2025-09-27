const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

// Existing routes (unchanged)
router.post('/add/us', (req, res) => portfolioController.addUSEquity(req, res));
router.post('/add/hk', (req, res) => portfolioController.addHKEquity(req, res));
router.post('/add/tw', (req, res) => portfolioController.addTWEquity(req, res));
router.get('/value', (req, res) => portfolioController.getPortfolioValue(req, res));
router.delete('/clear', (req, res) => portfolioController.clearPortfolio(req, res));

// NEW: Crypto route
router.post('/add/crypto', (req, res) => portfolioController.addCrypto(req, res));

module.exports = router;