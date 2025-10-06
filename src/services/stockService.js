const axios = require('axios');

class StockService {
  constructor() {
    this.finnhubKey = process.env.FINNHUB_API_KEY;
  }

  // US stock method using Yahoo Finance API
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

  // HK stock method
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

  // Taiwan stock method - Updated to handle both stocks and ETFs
async getTWStockPrice(symbol) {
    try {
      let formattedSymbol = symbol;
      
      // Don't modify if it already has a suffix
      if (!symbol.includes('.TW') && !symbol.includes('.TWO')) {
        // Try .TW first (for regular stocks)
        formattedSymbol = `${symbol}.TW`;
      }
      
      let response;
      
      try {
        response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${formattedSymbol}`, {
          params: {
            interval: '1d',
            range: '1d'
          },
          headers: {
            'User-Agent': 'Mozilla/5.0'
          }
        });
      } catch (error) {
        // If .TW fails and symbol looks like an ETF (contains letters), try .TWO
        if (error.response?.status === 404 && /[A-Z]/i.test(symbol)) {
          console.log(`Trying .TWO suffix for ${symbol}...`);
          formattedSymbol = `${symbol}.TWO`;
          
          response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${formattedSymbol}`, {
            params: {
              interval: '1d',
              range: '1d'
            },
            headers: {
              'User-Agent': 'Mozilla/5.0'
            }
          });
        } else {
          throw error;
        }
      }
  
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

  // Shanghai Stock Exchange method
async getSSStockPrice(symbol) {
    try {
      let formattedSymbol = symbol;
      
      if (!symbol.includes('.SS')) {
        formattedSymbol = `${symbol}.SS`;
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
        throw new Error(`No data found for Shanghai symbol: ${symbol}`);
      }
  
      const price = result.meta.regularMarketPrice;
      
      return {
        symbol: symbol,
        price: parseFloat(price),
        currency: 'CNY'
      };
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error(`Stock symbol ${symbol} not found. Please check the symbol.`);
      }
      throw new Error(`Failed to fetch Shanghai stock price for ${symbol}: ${error.message}`);
    }
  }
  
  // Shenzhen Stock Exchange method
  async getSZStockPrice(symbol) {
    try {
      let formattedSymbol = symbol;
      
      if (!symbol.includes('.SZ')) {
        formattedSymbol = `${symbol}.SZ`;
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
        throw new Error(`No data found for Shenzhen symbol: ${symbol}`);
      }
  
      const price = result.meta.regularMarketPrice;
      
      return {
        symbol: symbol,
        price: parseFloat(price),
        currency: 'CNY'
      };
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error(`Stock symbol ${symbol} not found. Please check the symbol.`);
      }
      throw new Error(`Failed to fetch Shenzhen stock price for ${symbol}: ${error.message}`);
    }
  }
  // Canada stock method
  async getCAStockPrice(symbol) {
    try {
      let formattedSymbol = symbol;
      
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

  // NEW: CryptoCompare Only - Supports ALL cryptocurrencies
  async getCryptoPrice(symbol) {
    const upperSymbol = symbol.toUpperCase();
    
    try {
      // CryptoCompare API supports thousands of cryptos automatically
      const response = await axios.get('https://min-api.cryptocompare.com/data/price', {
        params: {
          fsym: upperSymbol,  // From symbol (e.g., BTC, ETH, DOGE, SHIB, etc.)
          tsyms: 'USD'        // To symbol (always USD)
        },
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      // Check if price exists
      const price = response.data.USD;
      
      if (!price || price === 0) {
        throw new Error(`Cryptocurrency ${symbol} not found or not supported by CryptoCompare`);
      }

      return {
        symbol: upperSymbol,
        price: parseFloat(price),
        currency: 'USD'
      };
      
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error(`Cryptocurrency ${symbol} not found. Please verify the symbol.`);
      }
      
      // Check if it's a "market does not exist" error from CryptoCompare
      if (error.response?.data?.Message) {
        throw new Error(`${symbol}: ${error.response.data.Message}`);
      }
      
      throw new Error(`Failed to fetch crypto price for ${symbol}: ${error.message}`);
    }
  }
  // Add this method to src/services/stockService.js after the getCryptoPrice method

  // Get precious metal price
  async getMetalPrice(symbol, weightGrams) {
    try {
      // Yahoo Finance symbols for precious metals futures
      // GC=F (Gold), SI=F (Silver), PL=F (Platinum), PA=F (Palladium)
      
      const metalNames = {
        'GC=F': 'Gold',
        'SI=F': 'Silver',
        'PL=F': 'Platinum',
        'PA=F': 'Palladium'
      };
      
      if (!metalNames[symbol]) {
        throw new Error(`Unsupported metal symbol: ${symbol}. Supported: ${Object.keys(metalNames).join(', ')}`);
      }
      
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
        throw new Error(`No data found for metal: ${symbol}`);
      }

      // Price from Yahoo is per troy ounce in USD
      const pricePerOunce = parseFloat(result.meta.regularMarketPrice);
      
      // Convert grams to troy ounces (1 troy oz = 31.1035 grams)
      const GRAMS_PER_TROY_OUNCE = 31.1035;
      const ounces = weightGrams / GRAMS_PER_TROY_OUNCE;
      
      // Calculate total value
      const totalValue = pricePerOunce * ounces;
      
      return {
        symbol: metalNames[symbol],
        metalType: symbol,
        pricePerOunce: pricePerOunce,
        weightGrams: weightGrams,
        ounces: ounces,
        totalValue: totalValue,
        currency: 'USD'
      };
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error(`Metal symbol ${symbol} not found. Please check the symbol.`);
      }
      throw new Error(`Failed to fetch metal price for ${symbol}: ${error.message}`);
    }
  }
}


module.exports = new StockService();