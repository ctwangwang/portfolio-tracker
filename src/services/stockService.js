const axios = require('axios');

class StockService {
  constructor() {
    this.alphaVantageKey = process.env.ALPHA_VANTAGE_API_KEY;
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

  // FIXED: Crypto with multiple API fallbacks
  async getCryptoPrice(symbol) {
    const upperSymbol = symbol.toUpperCase();
    
    // Try CoinCap first (no rate limits, no API key needed)
    try {
      const response = await axios.get(
        `https://api.coincap.io/v2/assets/${upperSymbol.toLowerCase()}`,
        { timeout: 5000 }
      );
      
      const price = parseFloat(response.data.data.priceUsd);
      
      if (price) {
        return {
          symbol: upperSymbol,
          price: price,
          currency: 'USD'
        };
      }
    } catch (error) {
      console.log(`CoinCap failed for ${upperSymbol}, trying Binance...`);
    }

    // Try Binance as second option (no API key needed)
    try {
      const pair = `${upperSymbol}USDT`;
      const response = await axios.get(
        'https://api.binance.com/api/v3/ticker/price',
        {
          params: { symbol: pair },
          timeout: 5000
        }
      );
      
      const price = parseFloat(response.data.price);
      
      return {
        symbol: upperSymbol,
        price: price,
        currency: 'USD'
      };
    } catch (error) {
      console.log(`Binance failed for ${upperSymbol}, trying CoinGecko...`);
    }

    // Try CoinGecko as last resort (has rate limits)
    try {
      const coinId = this.cryptoIdMap[upperSymbol];
      
      if (!coinId) {
        throw new Error(`Crypto symbol ${symbol} not supported. Supported: ${Object.keys(this.cryptoIdMap).join(', ')}`);
      }
      
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price',
        {
          params: {
            ids: coinId,
            vs_currencies: 'usd'
          },
          timeout: 5000
        }
      );

      const price = response.data[coinId]?.usd;
      
      if (!price) {
        throw new Error(`No price data found for ${symbol}`);
      }

      return {
        symbol: upperSymbol,
        price: parseFloat(price),
        currency: 'USD'
      };
    } catch (error) {
      if (error.message.includes('not supported')) {
        throw error;
      }
      throw new Error(`Failed to fetch crypto price for ${symbol} from all APIs: ${error.message}`);
    }
  }
}

module.exports = new StockService();