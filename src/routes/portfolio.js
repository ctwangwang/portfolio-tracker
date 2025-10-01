const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

// Cash route - NEW
router.post('/add/cash', (req, res) => portfolioController.addCash(req, res));

// Equity routes
router.post('/add/us', (req, res) => portfolioController.addUSEquity(req, res));
router.post('/add/ca', (req, res) => portfolioController.addCAEquity(req, res));
router.post('/add/hk', (req, res) => portfolioController.addHKEquity(req, res));
router.post('/add/tw', (req, res) => portfolioController.addTWEquity(req, res));

// Crypto route
router.post('/add/crypto', (req, res) => portfolioController.addCrypto(req, res));

// Portfolio management
router.get('/value', (req, res) => portfolioController.getPortfolioValue(req, res));
router.delete('/clear', (req, res) => portfolioController.clearPortfolio(req, res));

module.exports = router;