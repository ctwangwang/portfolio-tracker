// server.js - Stock API Proxy Server
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Stock API Proxy Server is running'
  });
});

// Yahoo Finance proxy for US stocks
app.get('/api/stock/us/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    console.log(`Fetching US stock: ${symbol}`);
    
    const response = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`,
      {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    );
    
    if (response.data.chart?.result?.[0]?.meta?.regularMarketPrice) {
      const data = response.data.chart.result[0];
      const price = data.meta.regularMarketPrice;
      const previousClose = data.meta.previousClose;
      const change = price - previousClose;
      const changePercent = (change / previousClose) * 100;
      
      res.json({
        symbol: symbol.toUpperCase(),
        price: price,
        name: data.meta.shortName || symbol,
        currency: 'USD',
        change24h: change,
        changePercent: changePercent,
        lastUpdated: new Date().toISOString(),
        source: 'Yahoo Finance'
      });
    } else {
      throw new Error('No price data available');
    }
  } catch (error) {
    console.error(`Error fetching US stock ${req.params.symbol}:`, error.message);
    res.status(500).json({ 
      error: 'Failed to fetch stock data', 
      symbol: req.params.symbol,
      message: error.message 
    });
  }
});

// Yahoo Finance proxy for Hong Kong stocks
app.get('/api/stock/hk/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    // Format HK symbol (ensure 5 digits and add .HK suffix)
    const formattedSymbol = symbol.padStart(5, '0');
    console.log(`Fetching HK stock: ${formattedSymbol}`);
    
    const response = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${formattedSymbol}.HK?interval=1d&range=1d`,
      {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    );
    
    if (response.data.chart?.result?.[0]?.meta?.regularMarketPrice) {
      const data = response.data.chart.result[0];
      const price = data.meta.regularMarketPrice;
      const previousClose = data.meta.previousClose;
      const change = price - previousClose;
      const changePercent = (change / previousClose) * 100;
      
      res.json({
        symbol: formattedSymbol,
        price: price,
        name: data.meta.shortName || formattedSymbol,
        currency: 'HKD',
        change24h: change,
        changePercent: changePercent,
        lastUpdated: new Date().toISOString(),
        source: 'Yahoo Finance'
      });
    } else {
      throw new Error('No price data available');
    }
  } catch (error) {
    console.error(`Error fetching HK stock ${req.params.symbol}:`, error.message);
    res.status(500).json({ 
      error: 'Failed to fetch stock data', 
      symbol: req.params.symbol,
      message: error.message 
    });
  }
});

// Yahoo Finance proxy for Taiwan stocks
app.get('/api/stock/tw/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    console.log(`Fetching TW stock: ${symbol}`);
    
    const response = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.TW?interval=1d&range=1d`,
      {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    );
    
    if (response.data.chart?.result?.[0]?.meta?.regularMarketPrice) {
      const data = response.data.chart.result[0];
      const price = data.meta.regularMarketPrice;
      const previousClose = data.meta.previousClose;
      const change = price - previousClose;
      const changePercent = (change / previousClose) * 100;
      
      res.json({
        symbol: symbol,
        price: price,
        name: data.meta.shortName || symbol,
        currency: 'TWD',
        change24h: change,
        changePercent: changePercent,
        lastUpdated: new Date().toISOString(),
        source: 'Yahoo Finance'
      });
    } else {
      throw new Error('No price data available');
    }
  } catch (error) {
    console.error(`Error fetching TW stock ${req.params.symbol}:`, error.message);
    res.status(500).json({ 
      error: 'Failed to fetch stock data', 
      symbol: req.params.symbol,
      message: error.message 
    });
  }
});

// Currency exchange rates proxy
app.get('/api/currency', async (req, res) => {
  try {
    console.log('Fetching currency exchange rates');
    
    const response = await axios.get(
      'https://api.exchangerate-api.com/v4/latest/USD',
      { timeout: 10000 }
    );
    
    if (response.data.rates) {
      res.json({
        base: response.data.base,
        rates: response.data.rates,
        lastUpdated: new Date().toISOString(),
        source: 'ExchangeRate-API'
      });
    } else {
      throw new Error('No currency data available');
    }
  } catch (error) {
    console.error('Error fetching currency rates:', error.message);
    
    // Fallback to mock rates
    res.json({
      base: 'USD',
      rates: {
        USD: 1,
        CAD: 1.35,
        HKD: 7.8,
        TWD: 31.5,
        CNY: 7.2,
        EUR: 0.92,
        GBP: 0.79,
        JPY: 150
      },
      lastUpdated: new Date().toISOString(),
      source: 'Mock Data (Fallback)'
    });
  }
});

// Stock search endpoint
app.get('/api/search/:market/:query', async (req, res) => {
  try {
    const { market, query } = req.params;
    console.log(`Searching ${market} stocks for: ${query}`);
    
    // Simple search logic
    const results = [];
    
    if (market.toLowerCase() === 'us') {
      // For US stocks, just validate the symbol format
      const upperQuery = query.toUpperCase();
      if (/^[A-Z]{1,5}$/.test(upperQuery)) {
        results.push({
          symbol: upperQuery,
          name: `${upperQuery} (Validate by adding to portfolio)`,
          market: 'US'
        });
      }
    } else if (market.toLowerCase() === 'hk') {
      // For HK stocks, format and validate
      let formattedQuery = query.replace(/[^0-9]/g, '');
      if (formattedQuery.length > 0 && formattedQuery.length <= 5) {
        formattedQuery = formattedQuery.padStart(5, '0');
        results.push({
          symbol: formattedQuery,
          name: `${formattedQuery} (Validate by adding to portfolio)`,
          market: 'HK'
        });
      }
    } else if (market.toLowerCase() === 'tw') {
      // For TW stocks, validate 4-digit format
      if (/^\d{4}$/.test(query)) {
        results.push({
          symbol: query,
          name: `${query} (Validate by adding to portfolio)`,
          market: 'TW'
        });
      }
    }
    
    res.json(results);
  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({ 
      error: 'Search failed', 
      message: error.message 
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Stock API Proxy Server running at http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`💹 Example: http://localhost:${PORT}/api/stock/us/AAPL`);
  console.log(`\nEndpoints available:`);
  console.log(`  GET /health - Server health check`);
  console.log(`  GET /api/stock/us/:symbol - US stock price`);
  console.log(`  GET /api/stock/hk/:symbol - Hong Kong stock price`);
  console.log(`  GET /api/stock/tw/:symbol - Taiwan stock price`);
  console.log(`  GET /api/currency - Currency exchange rates`);
  console.log(`  GET /api/search/:market/:query - Search stocks`);
});

module.exports = app;