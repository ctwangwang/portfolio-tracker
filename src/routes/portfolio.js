const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

router.post('/add/us', (req, res) => portfolioController.addUSEquity(req, res));
router.get('/value', (req, res) => portfolioController.getPortfolioValue(req, res));
router.delete('/clear', (req, res) => portfolioController.clearPortfolio(req, res));

// NEW: HK equity route
router.post('/add/hk', (req, res) => portfolioController.addHKEquity(req, res));

module.exports = router;