const express = require('express');
const router = express.Router();
const stockService = require('../services/stockService');
const currencyService = require('../services/currencyService');

// ========== Price Lookup Routes (no storage, no logging) ==========

// Get US stock price
router.post('/price/us', async (req, res) => {
    try {
        const { symbol } = req.body;
        
        if (!symbol) {
            return res.status(400).json({ error: 'Symbol is required' });
        }
        
        const stockData = await stockService.getUSStockPrice(symbol);
        
        res.json({
            symbol: stockData.symbol,
            price: stockData.price,
            currency: stockData.currency
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Canada stock price
router.post('/price/ca', async (req, res) => {
    try {
        const { symbol } = req.body;
        
        if (!symbol) {
            return res.status(400).json({ error: 'Symbol is required' });
        }
        
        const stockData = await stockService.getCAStockPrice(symbol);
        
        res.json({
            symbol: stockData.symbol,
            price: stockData.price,
            currency: stockData.currency
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get HK stock price
router.post('/price/hk', async (req, res) => {
    try {
        const { symbol } = req.body;
        
        if (!symbol) {
            return res.status(400).json({ error: 'Symbol is required' });
        }
        
        const stockData = await stockService.getHKStockPrice(symbol);
        
        res.json({
            symbol: stockData.symbol,
            price: stockData.price,
            currency: stockData.currency
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Taiwan stock price
router.post('/price/tw', async (req, res) => {
    try {
        const { symbol } = req.body;
        
        if (!symbol) {
            return res.status(400).json({ error: 'Symbol is required' });
        }
        
        const stockData = await stockService.getTWStockPrice(symbol);
        
        res.json({
            symbol: stockData.symbol,
            price: stockData.price,
            currency: stockData.currency
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Shanghai stock price
router.post('/price/ss', async (req, res) => {
    try {
        const { symbol } = req.body;
        
        if (!symbol) {
            return res.status(400).json({ error: 'Symbol is required' });
        }
        
        const stockData = await stockService.getSSStockPrice(symbol);
        
        res.json({
            symbol: stockData.symbol,
            price: stockData.price,
            currency: stockData.currency
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Shenzhen stock price
router.post('/price/sz', async (req, res) => {
    try {
        const { symbol } = req.body;
        
        if (!symbol) {
            return res.status(400).json({ error: 'Symbol is required' });
        }
        
        const stockData = await stockService.getSZStockPrice(symbol);
        
        res.json({
            symbol: stockData.symbol,
            price: stockData.price,
            currency: stockData.currency
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get crypto price
router.post('/price/crypto', async (req, res) => {
    try {
        const { symbol } = req.body;
        
        if (!symbol) {
            return res.status(400).json({ error: 'Symbol is required' });
        }
        
        const cryptoData = await stockService.getCryptoPrice(symbol);
        
        res.json({
            symbol: cryptoData.symbol,
            price: cryptoData.price,
            currency: cryptoData.currency
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add this route to src/routes/portfolio.js after the crypto price route

// Get metal price
router.post('/price/metal', async (req, res) => {
    try {
        const { symbol, weightGrams } = req.body;
        
        if (!symbol || !weightGrams) {
            return res.status(400).json({ error: 'Symbol and weightGrams are required' });
        }
        
        const metalData = await stockService.getMetalPrice(symbol, weightGrams);
        
        res.json({
            symbol: metalData.symbol,
            pricePerOunce: metalData.pricePerOunce,
            weightGrams: metalData.weightGrams,
            totalValue: metalData.totalValue,
            currency: metalData.currency
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// ========== Portfolio Calculation Route ==========

// Calculate total portfolio value with currency conversions
// Note: No logging of portfolio contents for privacy
router.post('/calculate', async (req, res) => {
    try {
        const { holdings } = req.body;
        
        if (!holdings || !Array.isArray(holdings)) {
            return res.status(400).json({ error: 'Holdings array is required' });
        }
        
        if (holdings.length === 0) {
            return res.json({ 
                totalUSD: 0,
                conversions: {}
            });
        }
        
        // Calculate total in USD
        let totalUSD = 0;
        
        for (const holding of holdings) {
            // For cash holdings, the value is already the amount in that currency
            if (holding.market === 'CASH') {
                if (holding.currency === 'USD') {
                    totalUSD += holding.value;
                } else {
                    const usdValue = await currencyService.convertCurrency(
                        holding.value, 
                        holding.currency, 
                        'USD'
                    );
                    totalUSD += usdValue;
                }
            } 
            // For metal holdings
            else if (holding.market === 'METAL') {
                // Metals are always priced in USD
                totalUSD += holding.value;
            }
            // For stocks/crypto
            else {
                if (holding.currency === 'USD') {
                    totalUSD += holding.value;
                } else {
                    const usdValue = await currencyService.convertCurrency(
                        holding.value, 
                        holding.currency, 
                        'USD'
                    );
                    totalUSD += usdValue;
                }
            }
        }
        
        // Convert to multiple currencies
        const conversions = await currencyService.getMultipleCurrencies(totalUSD, 'USD');
        
        res.json({
            totalUSD,
            conversions
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;