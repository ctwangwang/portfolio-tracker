const stockService = require('../services/stockService');
const currencyService = require('../services/currencyService');

class PortfolioController {
  constructor() {
    this.portfolio = [];
  }

  // NEW: Add cash method
  async addCash(req, res) {
    try {
      const { currency, amount } = req.body;

      if (!currency || !amount) {
        return res.status(400).json({ error: 'Currency and amount are required' });
      }

      // Validate currency
      const validCurrencies = ['USD', 'CAD', 'HKD', 'TWD', 'CNY', 'EUR', 'GBP', 'JPY', 'KRW', 'AUD', 'SGD'];
      if (!validCurrencies.includes(currency.toUpperCase())) {
        return res.status(400).json({ 
          error: `Invalid currency. Supported: ${validCurrencies.join(', ')}` 
        });
      }

      const holding = {
        symbol: currency.toUpperCase(),
        quantity: 1, // For cash, quantity is always 1
        price: parseFloat(amount),
        currency: currency.toUpperCase(),
        value: parseFloat(amount),
        market: 'CASH'
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

  async addCAEquity(req, res) {
    try {
      const { symbol, quantity } = req.body;

      if (!symbol || !quantity) {
        return res.status(400).json({ error: 'Symbol and quantity are required' });
      }

      const stockData = await stockService.getCAStockPrice(symbol);
      
      const holding = {
        symbol: stockData.symbol,
        quantity: parseInt(quantity),
        price: stockData.price,
        currency: stockData.currency,
        value: stockData.price * quantity,
        market: 'CA'
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

  async addCrypto(req, res) {
    try {
      const { symbol, quantity } = req.body;

      if (!symbol || !quantity) {
        return res.status(400).json({ error: 'Symbol and quantity are required' });
      }

      const cryptoData = await stockService.getCryptoPrice(symbol);
      
      const holding = {
        symbol: cryptoData.symbol,
        quantity: parseFloat(quantity),
        price: cryptoData.price,
        currency: cryptoData.currency,
        value: cryptoData.price * quantity,
        market: 'CRYPTO'
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

  // UPDATED: Handle all currencies including cash currencies
  async getPortfolioValue(req, res) {
    try {
      if (this.portfolio.length === 0) {
        return res.json({ message: 'Portfolio is empty', totalValue: 0 });
      }

      // Calculate total, converting all to USD first
      let totalUSD = 0;
      
      for (const holding of this.portfolio) {
        // For cash holdings, the value is already the amount in that currency
        if (holding.market === 'CASH') {
          if (holding.currency === 'USD') {
            totalUSD += holding.value;
          } else {
            const usdValue = await currencyService.convertCurrency(holding.value, holding.currency, 'USD');
            totalUSD += usdValue;
          }
        } else {
          // For stocks/crypto
          if (holding.currency === 'USD') {
            totalUSD += holding.value;
          } else if (holding.currency === 'HKD') {
            const usdValue = await currencyService.convertCurrency(holding.value, 'HKD', 'USD');
            totalUSD += usdValue;
          } else if (holding.currency === 'TWD') {
            const usdValue = await currencyService.convertCurrency(holding.value, 'TWD', 'USD');
            totalUSD += usdValue;
          } else if (holding.currency === 'CAD') {
            const usdValue = await currencyService.convertCurrency(holding.value, 'CAD', 'USD');
            totalUSD += usdValue;
          }
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