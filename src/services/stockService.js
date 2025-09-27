const axios = require('axios');

class StockService {
  constructor() {
    this.alphaVantageKey = process.env.ALPHA_VANTAGE_API_KEY;
    this.finnhubKey = process.env.FINNHUB_API_KEY;
  }

  // Existing US stock method (unchanged)
  async getUSStockPrice(symbol) {
    try {
      const response = await axios.get('https://www.alphavantage.co/query', {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: symbol,
          apikey: this.alphaVantageKey
        }
      });

      const quote = response.data['Global Quote'];
      
      if (!quote || Object.keys(quote).length === 0) {
        throw new Error(`No data found for symbol: ${symbol}`);
      }

      return {
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        currency: 'USD'
      };
    } catch (error) {
      throw new Error(`Failed to fetch US stock price for ${symbol}: ${error.message}`);
    }
  }

  // UPDATED: HK stock method using Yahoo Finance
  async getHKStockPrice(symbol) {
    try {
      // Format HK stock symbol for Yahoo Finance
      // Yahoo format: 0700.HK for Hong Kong stocks
      let formattedSymbol = symbol;
      
      // If user enters just the number (e.g., "0700"), add .HK
      if (!symbol.includes('.HK')) {
        // Pad with zeros if needed (e.g., "700" -> "0700")
        const paddedNumber = symbol.padStart(4, '0');
        formattedSymbol = `${paddedNumber}.HK`;
      }
      
      // Yahoo Finance API endpoint (free, no key required)
      const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${formattedSymbol}`, {
        params: {
          interval: '1d',
          range: '1d'
        },
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      });

      const result = response.data.chart.result[0];
      
      if (!result || !result.meta || !result.meta.regularMarketPrice) {
        throw new Error(`No data found for HK symbol: ${symbol}`);
      }

      const price = result.meta.regularMarketPrice;
      
      return {
        symbol: symbol,
        price: parseFloat(price),
        currency: 'HKD'
      };
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error(`Stock symbol ${symbol} not found. Please check the symbol.`);
      }
      throw new Error(`Failed to fetch HK stock price for ${symbol}: ${error.message}`);
    }
  }
}

module.exports = new StockService();