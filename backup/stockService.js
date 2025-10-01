const axios = require('axios');

class StockService {
  constructor() {
    // Removed alphaVantageKey since we're now using Yahoo Finance for US stocks
    this.finnhubKey = process.env.FINNHUB_API_KEY;
    
    // CoinGecko symbol to ID mapping
    this.cryptoIdMap = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'USDT': 'tether',
      'BNB': 'binancecoin',
      'SOL': 'solana',
      'ADA': 'cardano',
      'XRP': 'ripple',
      'DOT': 'polkadot',
      'DOGE': 'dogecoin',
      'MATIC': 'matic-network',
      'AVAX': 'avalanche-2',
      'LINK': 'chainlink',
      'UNI': 'uniswap',
      'ATOM': 'cosmos',
      'LTC': 'litecoin',
      'BCH': 'bitcoin-cash',
      'ALGO': 'algorand',
      'TRX': 'tron',
      'SHIB': 'shiba-inu'
    };
  }

  // UPDATED: US stock method using Yahoo Finance API
  async getUSStockPrice(symbol) {
    try {
      const response = await axios.get(
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`,
        {
          params: {
            interval: '1d',
            range: '1d'
          },
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        }
      );

      const result = response.data.chart.result[0];
      
      if (!result || !result.meta || !result.meta.regularMarketPrice) {
        throw new Error(`No data found for symbol: ${symbol}`);
      }

      return {
        symbol: result.meta.symbol || symbol,
        price: parseFloat(result.meta.regularMarketPrice),
        currency: result.meta.currency || 'USD'
      };
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error(`Stock symbol ${symbol} not found. Please check the symbol.`);
      }
      throw new Error(`Failed to fetch US stock price for ${symbol}: ${error.message}`);
    }
  }

  // Existing HK stock method (unchanged)
  async getHKStockPrice(symbol) {
    try {
      let formattedSymbol = symbol;
      
      if (!symbol.includes('.HK')) {
        const paddedNumber = symbol.padStart(4, '0');
        formattedSymbol = `${paddedNumber}.HK`;
      }
      
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

  // Existing Taiwan stock method (unchanged)
  async getTWStockPrice(symbol) {
    try {
      let formattedSymbol = symbol;
      
      if (!symbol.includes('.TW')) {
        formattedSymbol = `${symbol}.TW`;
      }
      
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
        throw new Error(`No data found for Taiwan symbol: ${symbol}`);
      }

      const price = result.meta.regularMarketPrice;
      
      return {
        symbol: symbol,
        price: parseFloat(price),
        currency: 'TWD'
      };
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error(`Stock symbol ${symbol} not found. Please check the symbol.`);
      }
      throw new Error(`Failed to fetch Taiwan stock price for ${symbol}: ${error.message}`);
    }
  }

  // NEW: Canada stock method
  async getCAStockPrice(symbol) {
    try {
      // Format Canada stock symbol for Yahoo Finance
      // Yahoo format: SHOP.TO for Toronto Stock Exchange stocks
      let formattedSymbol = symbol;
      
      // If user enters just the symbol (e.g., "SHOP"), add .TO
      if (!symbol.includes('.TO')) {
        formattedSymbol = `${symbol}.TO`;
      }
      
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
        throw new Error(`No data found for Canada symbol: ${symbol}`);
      }

      const price = result.meta.regularMarketPrice;
      
      return {
        symbol: symbol,
        price: parseFloat(price),
        currency: 'CAD'
      };
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error(`Stock symbol ${symbol} not found. Please check the symbol.`);
      }
      throw new Error(`Failed to fetch Canada stock price for ${symbol}: ${error.message}`);
    }
  }

  // UPDATED: Crypto method optimized for Render deployment - Binance + CryptoCompare
  async getCryptoPrice(symbol) {
    const upperSymbol = symbol.toUpperCase();
    
    // Validate if symbol is supported
    if (!this.cryptoIdMap[upperSymbol]) {
      throw new Error(`Crypto symbol ${symbol} not supported. Supported: ${Object.keys(this.cryptoIdMap).join(', ')}`);
    }
    
    // Try APIs in order of reliability for cloud platforms
    const apis = [
      // API 1: Binance Public API (most reliable for cloud platforms)
      async () => {
        const pair = `${upperSymbol}USDT`;
        const response = await axios.get('https://api.binance.com/api/v3/ticker/price', {
          params: { symbol: pair },
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });

        const price = parseFloat(response.data.price);
        if (!price || price === 0) {
          throw new Error('NO_PRICE_DATA');
        }

        return {
          symbol: upperSymbol,
          price: price,
          currency: 'USD',
          source: 'Binance'
        };
      },
      
      // API 2: CryptoCompare (reliable fallback)
      async () => {
        const response = await axios.get('https://min-api.cryptocompare.com/data/price', {
          params: {
            fsym: upperSymbol,
            tsyms: 'USD'
          },
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });

        const price = response.data.USD;
        if (!price || price === 0) {
          throw new Error('NO_PRICE_DATA');
        }

        return {
          symbol: upperSymbol,
          price: parseFloat(price),
          currency: 'USD',
          source: 'CryptoCompare'
        };
      }
    ];

    // Try each API in sequence
    let lastError;
    for (let i = 0; i < apis.length; i++) {
      try {
        console.log(`Trying crypto API ${i + 1} for ${upperSymbol}...`);
        const result = await apis[i]();
        console.log(`✓ Got ${upperSymbol} price from ${result.source}: $${result.price}`);
        return result;
      } catch (error) {
        lastError = error;
        console.log(`✗ API ${i + 1} failed for ${upperSymbol}: ${error.response?.status || error.message}`);
        
        // Continue to next API
        continue;
      }
    }

    // All APIs failed
    throw new Error(`Failed to fetch crypto price for ${symbol} from all APIs: ${lastError?.message || 'Unknown error'}`);
  }
}

module.exports = new StockService();