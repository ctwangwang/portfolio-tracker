const axios = require('axios');

async function testCryptoAPIs() {
    const testSymbols = ['BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'ADA']; // Popular cryptos
    
    console.log('=== Testing Crypto APIs ===\n');
    
    // Test 1: CoinGecko (Free, No API Key Required)
    console.log('--- Test 1: CoinGecko API (Free, No Key) ---');
    const coinGeckoIds = {
        'BTC': 'bitcoin',
        'ETH': 'ethereum',
        'USDT': 'tether',
        'BNB': 'binancecoin',
        'SOL': 'solana',
        'ADA': 'cardano'
    };
    
    try {
        const ids = Object.values(coinGeckoIds).join(',');
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
            params: {
                ids: ids,
                vs_currencies: 'usd'
            }
        });
        
        for (const [symbol, id] of Object.entries(coinGeckoIds)) {
            const price = response.data[id]?.usd;
            if (price) {
                console.log(`✓ ${symbol}: $${price.toLocaleString()}`);
            } else {
                console.log(`✗ ${symbol}: No data`);
            }
        }
    } catch (error) {
        console.log(`✗ CoinGecko Error: ${error.response?.status || error.message}`);
    }
    
    // Test 2: CoinCap (Free, No API Key Required)
    console.log('\n--- Test 2: CoinCap API (Free, No Key) ---');
    for (const symbol of testSymbols) {
        try {
            const response = await axios.get(`https://api.coincap.io/v2/assets/${symbol.toLowerCase()}`);
            const data = response.data.data;
            
            if (data) {
                console.log(`✓ ${symbol}: $${parseFloat(data.priceUsd).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`);
            } else {
                console.log(`✗ ${symbol}: No data`);
            }
        } catch (error) {
            console.log(`✗ ${symbol}: ${error.response?.status || error.message}`);
        }
    }
    
    // Test 3: Binance Public API (Free, No Key Required)
    console.log('\n--- Test 3: Binance Public API (Free, No Key) ---');
    for (const symbol of testSymbols) {
        try {
            const pair = `${symbol}USDT`;
            const response = await axios.get('https://api.binance.com/api/v3/ticker/price', {
                params: {
                    symbol: pair
                }
            });
            
            const price = parseFloat(response.data.price);
            console.log(`✓ ${symbol}: $${price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 8})}`);
        } catch (error) {
            console.log(`✗ ${symbol}: ${error.response?.status || error.message}`);
        }
    }
    
    // Test 4: CryptoCompare (Free tier available)
    console.log('\n--- Test 4: CryptoCompare API (Free, No Key) ---');
    try {
        const symbolsStr = testSymbols.join(',');
        const response = await axios.get('https://min-api.cryptocompare.com/data/pricemulti', {
            params: {
                fsyms: symbolsStr,
                tsyms: 'USD'
            }
        });
        
        for (const symbol of testSymbols) {
            const price = response.data[symbol]?.USD;
            if (price) {
                console.log(`✓ ${symbol}: $${price.toLocaleString()}`);
            } else {
                console.log(`✗ ${symbol}: No data`);
            }
        }
    } catch (error) {
        console.log(`✗ CryptoCompare Error: ${error.response?.status || error.message}`);
    }
    
    // Test 5: Kraken Public API (Free, No Key Required)
    console.log('\n--- Test 5: Kraken Public API (Free, No Key) ---');
    const krakenPairs = {
        'BTC': 'XXBTZUSD',
        'ETH': 'XETHZUSD',
        'SOL': 'SOLUSD',
        'ADA': 'ADAUSD'
    };
    
    for (const [symbol, pair] of Object.entries(krakenPairs)) {
        try {
            const response = await axios.get('https://api.kraken.com/0/public/Ticker', {
                params: {
                    pair: pair
                }
            });
            
            const result = response.data.result;
            const key = Object.keys(result)[0];
            const price = parseFloat(result[key].c[0]);
            
            console.log(`✓ ${symbol}: $${price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`);
        } catch (error) {
            console.log(`✗ ${symbol}: ${error.response?.status || error.message}`);
        }
    }
    
    // Test 6: Finnhub (if your key works)
    console.log('\n--- Test 6: Finnhub Crypto ---');
    require('dotenv').config();
    const finnhubKey = process.env.FINNHUB_API_KEY;
    
    if (finnhubKey) {
        for (const symbol of ['BTC', 'ETH']) {
            try {
                const response = await axios.get('https://finnhub.io/api/v1/quote', {
                    params: {
                        symbol: `BINANCE:${symbol}USDT`,
                        token: finnhubKey
                    }
                });
                
                const data = response.data;
                
                if (data.c && data.c !== 0) {
                    console.log(`✓ ${symbol}: $${data.c.toLocaleString()}`);
                } else {
                    console.log(`✗ ${symbol}: No data returned`);
                }
            } catch (error) {
                console.log(`✗ ${symbol}: ${error.response?.status || error.message}`);
            }
        }
    } else {
        console.log('Finnhub API key not found, skipping test');
    }
    
    console.log('\n=== Test Complete ===');
    console.log('\nAPI Comparison:');
    console.log('1. CoinGecko - Free, no key, reliable, good for price tracking');
    console.log('2. CoinCap - Free, no key, simple API');
    console.log('3. Binance - Free, no key, real-time trading prices');
    console.log('4. CryptoCompare - Free tier, good data quality');
    console.log('5. Kraken - Free, no key, exchange prices');
    console.log('6. Finnhub - Requires key (might have same 401 issue)');
    
    console.log('\nCommon Crypto Symbols to test:');
    console.log('BTC - Bitcoin');
    console.log('ETH - Ethereum');
    console.log('USDT - Tether');
    console.log('BNB - Binance Coin');
    console.log('SOL - Solana');
    console.log('ADA - Cardano');
    console.log('XRP - Ripple');
    console.log('DOT - Polkadot');
    console.log('DOGE - Dogecoin');
    console.log('MATIC - Polygon');
}

testCryptoAPIs();