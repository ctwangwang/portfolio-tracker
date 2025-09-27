const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

// Existing routes (unchanged)
router.post('/add/us', (req, res) => portfolioController.addUSEquity(req, res));
router.post('/add/hk', (req, res) => portfolioController.addHKEquity(req, res));
router.post('/add/tw', (req, res) => portfolioController.addTWEquity(req, res));
router.post('/add/crypto', (req, res) => portfolioController.addCrypto(req, res));
router.get('/value', (req, res) => portfolioController.getPortfolioValue(req, res));
router.delete('/clear', (req, res) => portfolioController.clearPortfolio(req, res));

// NEW: Canada equity route
router.post('/add/ca', (req, res) => portfolioController.addCAEquity(req, res));

module.exports = router;