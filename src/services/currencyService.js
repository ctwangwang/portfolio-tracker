const axios = require('axios');

class CurrencyService {
  constructor() {
    this.apiKey = process.env.EXCHANGE_RATE_API_KEY;
    this.baseUrl = 'https://v6.exchangerate-api.com/v6';
  }

  async convertCurrency(amount, fromCurrency, toCurrency) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/${this.apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`
      );

      if (response.data.result !== 'success') {
        throw new Error('Currency conversion failed');
      }

      return response.data.conversion_result;
    } catch (error) {
      throw new Error(`Currency conversion error: ${error.message}`);
    }
  }

  async getMultipleCurrencies(amount, fromCurrency) {
    // UPDATED: 10 currencies (removed SGD)
    const currencies = ['USD', 'CAD', 'HKD', 'TWD', 'CNY', 'JPY', 'EUR', 'GBP', 'KRW', 'AUD'];
    const results = {};

    for (const currency of currencies) {
      try {
        if (currency === fromCurrency) {
          results[currency] = amount;
        } else {
          results[currency] = await this.convertCurrency(amount, fromCurrency, currency);
        }
      } catch (error) {
        results[currency] = { error: error.message };
      }
    }

    return results;
  }
}

module.exports = new CurrencyService();