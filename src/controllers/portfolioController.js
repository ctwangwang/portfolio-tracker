const stockService = require('../services/stockService');
const currencyService = require('../services/currencyService');

class PortfolioController {
  constructor() {
    this.portfolio = [];
  }

  // Existing methods (unchanged)
  async addUSEquity(req, res) {
    try {
      const { symbol, quantity } = req.body;

      if (!symbol || !quantity) {
        return res.status(400).json({ error: 'Symbol and quantity are required' });
      }

      const stockData = await stockService.getUSStockPrice(symbol);
      
      const holding = {
        symbol: stockData.symbol,
        quantity: parseInt(quantity),
        price: stockData.price,
        currency: stockData.currency,
        value: stockData.price * quantity,
        market: 'US'
      };

      this.portfolio.push(holding);

      res.json({
        success: true,
        holding,
        portfolio: this.portfolio
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async addHKEquity(req, res) {
    try {
      const { symbol, quantity } = req.body;

      if (!symbol || !quantity) {
        return res.status(400).json({ error: 'Symbol and quantity are required' });
      }

      const stockData = await stockService.getHKStockPrice(symbol);
      
      const holding = {
        symbol: stockData.symbol,
        quantity: parseInt(quantity),
        price: stockData.price,
        currency: stockData.currency,
        value: stockData.price * quantity,
        market: 'HK'
      };

      this.portfolio.push(holding);

      res.json({
        success: true,
        holding,
        portfolio: this.portfolio
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // NEW: Add Taiwan equity method
  async addTWEquity(req, res) {
    try {
      const { symbol, quantity } = req.body;

      if (!symbol || !quantity) {
        return res.status(400).json({ error: 'Symbol and quantity are required' });
      }

      const stockData = await stockService.getTWStockPrice(symbol);
      
      const holding = {
        symbol: stockData.symbol,
        quantity: parseInt(quantity),
        price: stockData.price,
        currency: stockData.currency,
        value: stockData.price * quantity,
        market: 'TW'
      };

      this.portfolio.push(holding);

      res.json({
        success: true,
        holding,
        portfolio: this.portfolio
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // UPDATED: Handle multiple currencies including TWD
  async getPortfolioValue(req, res) {
    try {
      if (this.portfolio.length === 0) {
        return res.json({ message: 'Portfolio is empty', totalValue: 0 });
      }

      // Calculate total, converting all to USD first
      let totalUSD = 0;
      
      for (const holding of this.portfolio) {
        if (holding.currency === 'USD') {
          totalUSD += holding.value;
        } else if (holding.currency === 'HKD') {
          const usdValue = await currencyService.convertCurrency(holding.value, 'HKD', 'USD');
          totalUSD += usdValue;
        } else if (holding.currency === 'TWD') {
          const usdValue = await currencyService.convertCurrency(holding.value, 'TWD', 'USD');
          totalUSD += usdValue;
        }
      }

      // Convert to multiple currencies
      const values = await currencyService.getMultipleCurrencies(totalUSD, 'USD');

      res.json({
        holdings: this.portfolio,
        totalValue: {
          base: { amount: totalUSD, currency: 'USD' },
          conversions: values
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  clearPortfolio(req, res) {
    this.portfolio = [];
    res.json({ success: true, message: 'Portfolio cleared' });
  }
}

module.exports = new PortfolioController();