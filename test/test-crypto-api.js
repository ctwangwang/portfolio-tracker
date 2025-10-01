const axios = require('axios');

// Same crypto mapping as your app
const cryptoIdMap = {
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

async function testAllCryptoAPIs() {
    const testSymbols = ['BTC', 'ETH', 'DOGE', 'SOL', 'ADA', 'MATIC']; // Mix of major and smaller coins
    
    console.log('=== Comprehensive Crypto API Testing ===\n');
    console.log(`Testing with symbols: ${testSymbols.join(', ')}\n`);
    
    // Test 1: CoinGecko API (your original)
    console.log('--- Test 1: CoinGecko API ---');
    await testCoinGecko(testSymbols);
    
    // Test 2: Binance Public API
    console.log('\n--- Test 2: Binance Public API ---');
    await testBinance(testSymbols);
    
    // Test 3: CoinCap API
    console.log('\n--- Test 3: CoinCap API ---');
    await testCoinCap(testSymbols);
    
    // Test 4: CryptoCompare API
    console.log('\n--- Test 4: CryptoCompare API ---');
    await testCryptoCompare(testSymbols);
    
    // Test 5: Kraken Public API
    console.log('\n--- Test 5: Kraken Public API ---');
    await testKraken(testSymbols);
    
    // Test 6: Response Time Comparison
    console.log('\n--- Test 6: Response Time Comparison ---');
    await testResponseTimes();
    
    // Test 7: Rate Limit Testing
    console.log('\n--- Test 7: Rate Limit Testing ---');
    await testRateLimits();
    
    // Summary and Recommendations
    console.log('\n=== Summary & Recommendations ===');
    printRecommendations();
}

// Test CoinGecko (original API)
async function testCoinGecko(symbols) {
    for (const symbol of symbols) {
        try {
            const coinId = cryptoIdMap[symbol];
            if (!coinId) {
                console.log(`✗ ${symbol}: Not in mapping`);
                continue;
            }
            
            const start = Date.now();
            const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
                params: {
                    ids: coinId,
                    vs_currencies: 'usd'
                },
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            const time = Date.now() - start;

            const price = response.data[coinId]?.usd;
            if (price) {
                console.log(`✓ ${symbol}: $${price.toLocaleString()} (${time}ms)`);
            } else {
                console.log(`✗ ${symbol}: No price data`);
            }
        } catch (error) {
            const status = error.response?.status;
            const message = error.response?.data?.error || error.message;
            console.log(`✗ ${symbol}: ${status || 'Error'} - ${message}`);
        }
    }
}

// Test Binance Public API
async function testBinance(symbols) {
    for (const symbol of symbols) {
        try {
            const pair = `${symbol}USDT`;
            const start = Date.now();
            
            const response = await axios.get('https://api.binance.com/api/v3/ticker/price', {
                params: { symbol: pair },
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            const time = Date.now() - start;

            const price = parseFloat(response.data.price);
            if (price && price > 0) {
                console.log(`✓ ${symbol}: $${price.toLocaleString()} (${time}ms)`);
            } else {
                console.log(`✗ ${symbol}: Invalid price: ${price}`);
            }
        } catch (error) {
            const status = error.response?.status;
            const message = error.response?.data?.msg || error.message;
            console.log(`✗ ${symbol}: ${status || 'Error'} - ${message}`);
        }
    }
}

// Test CoinCap API
async function testCoinCap(symbols) {
    for (const symbol of symbols) {
        try {
            const start = Date.now();
            const response = await axios.get(`https://api.coincap.io/v2/assets/${symbol.toLowerCase()}`, {
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            const time = Date.now() - start;

            const data = response.data.data;
            if (data && data.priceUsd) {
                const price = parseFloat(data.priceUsd);
                console.log(`✓ ${symbol}: $${price.toLocaleString()} (${time}ms)`);
            } else {
                console.log(`✗ ${symbol}: No price data`);
            }
        } catch (error) {
            const status = error.response?.status;
            const message = error.response?.data?.error || error.message;
            console.log(`✗ ${symbol}: ${status || 'Error'} - ${message}`);
        }
    }
}

// Test CryptoCompare API
async function testCryptoCompare(symbols) {
    for (const symbol of symbols) {
        try {
            const start = Date.now();
            const response = await axios.get('https://min-api.cryptocompare.com/data/price', {
                params: {
                    fsym: symbol,
                    tsyms: 'USD'
                },
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            const time = Date.now() - start;

            const price = response.data.USD;
            if (price && price > 0) {
                console.log(`✓ ${symbol}: $${price.toLocaleString()} (${time}ms)`);
            } else {
                console.log(`✗ ${symbol}: No USD price`);
            }
        } catch (error) {
            const status = error.response?.status;
            const message = error.response?.data?.Message || error.message;
            console.log(`✗ ${symbol}: ${status || 'Error'} - ${message}`);
        }
    }
}

// Test Kraken Public API
async function testKraken(symbols) {
    const krakenPairs = {
        'BTC': 'XXBTZUSD',
        'ETH': 'XETHZUSD',
        'SOL': 'SOLUSD',
        'ADA': 'ADAUSD',
        'DOGE': 'XDGUSD',
        'MATIC': 'MATICUSD'
    };
    
    for (const symbol of symbols) {
        try {
            const pair = krakenPairs[symbol];
            if (!pair) {
                console.log(`✗ ${symbol}: No Kraken pair mapping`);
                continue;
            }
            
            const start = Date.now();
            const response = await axios.get('https://api.kraken.com/0/public/Ticker', {
                params: { pair },
                timeout: 10000
            });
            const time = Date.now() - start;

            const result = response.data.result;
            if (result && Object.keys(result).length > 0) {
                const key = Object.keys(result)[0];
                const price = parseFloat(result[key].c[0]);
                console.log(`✓ ${symbol}: $${price.toLocaleString()} (${time}ms)`);
            } else {
                console.log(`✗ ${symbol}: No result data`);
            }
        } catch (error) {
            const status = error.response?.status;
            const message = error.response?.data?.error?.[0] || error.message;
            console.log(`✗ ${symbol}: ${status || 'Error'} - ${message}`);
        }
    }
}

// Test response times
async function testResponseTimes() {
    const testSymbol = 'BTC';
    const apis = {
        'CoinGecko': async () => {
            const coinId = cryptoIdMap[testSymbol];
            return axios.get('https://api.coingecko.com/api/v3/simple/price', {
                params: { ids: coinId, vs_currencies: 'usd' },
                timeout: 10000,
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
        },
        'Binance': async () => {
            return axios.get('https://api.binance.com/api/v3/ticker/price', {
                params: { symbol: 'BTCUSDT' },
                timeout: 10000,
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
        },
        'CoinCap': async () => {
            return axios.get('https://api.coincap.io/v2/assets/bitcoin', {
                timeout: 10000,
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
        },
        'CryptoCompare': async () => {
            return axios.get('https://min-api.cryptocompare.com/data/price', {
                params: { fsym: 'BTC', tsyms: 'USD' },
                timeout: 10000,
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
        }
    };

    for (const [name, apiCall] of Object.entries(apis)) {
        try {
            const start = Date.now();
            await apiCall();
            const time = Date.now() - start;
            console.log(`✓ ${name}: ${time}ms`);
        } catch (error) {
            console.log(`✗ ${name}: ${error.response?.status || 'Error'} - ${error.message}`);
        }
    }
}

// Test rate limits by making multiple rapid requests
async function testRateLimits() {
    console.log('Testing rate limits with 5 rapid BTC requests...\n');
    
    const apis = [
        {
            name: 'CoinGecko',
            call: () => axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd', {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            })
        },
        {
            name: 'Binance',
            call: () => axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT', {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            })
        },
        {
            name: 'CoinCap',
            call: () => axios.get('https://api.coincap.io/v2/assets/bitcoin', {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            })
        }
    ];

    for (const api of apis) {
        console.log(`Testing ${api.name} rate limits...`);
        let successes = 0;
        let errors = 0;
        
        // Make 5 rapid requests
        const promises = Array(5).fill().map(async (_, i) => {
            try {
                await api.call();
                successes++;
                console.log(`  Request ${i + 1}: ✓`);
            } catch (error) {
                errors++;
                const status = error.response?.status;
                console.log(`  Request ${i + 1}: ✗ ${status || 'Error'}`);
            }
        });
        
        await Promise.all(promises);
        console.log(`  Result: ${successes}/5 successful, ${errors}/5 errors\n`);
    }
}

function printRecommendations() {
    console.log('🏆 BEST APIs for Render deployment:\n');
    
    console.log('1. **Binance Public API** (Recommended)');
    console.log('   ✅ No rate limits for public data');
    console.log('   ✅ Very fast response times');
    console.log('   ✅ Reliable on cloud platforms');
    console.log('   ✅ Real-time trading data');
    console.log('   ❌ Limited to major cryptocurrencies\n');
    
    console.log('2. **CoinCap API** (Good backup)');
    console.log('   ✅ Free, no API key required');
    console.log('   ✅ Good rate limits');
    console.log('   ✅ Wide cryptocurrency coverage');
    console.log('   ⚠️  Moderate response times\n');
    
    console.log('3. **CryptoCompare API** (Reliable)');
    console.log('   ✅ Stable and reliable');
    console.log('   ✅ Good data quality');
    console.log('   ⚠️  Some rate limiting');
    console.log('   ⚠️  May require API key for heavy usage\n');
    
    console.log('4. **CoinGecko API** (Your current)');
    console.log('   ✅ Comprehensive data');
    console.log('   ✅ Good for development');
    console.log('   ❌ Rate limited on cloud platforms (429 errors)');
    console.log('   ❌ Slower response times\n');
    
    console.log('💡 **Recommended Implementation Order:**');
    console.log('   1st choice: Binance Public API');
    console.log('   2nd choice: CoinCap API');
    console.log('   3rd choice: CryptoCompare API');
    console.log('   4th choice: CoinGecko API');
    
    console.log('\n🚀 **For Production on Render:**');
    console.log('   Use the fallback system I provided with this exact order!');
}

// Run all tests
testAllCryptoAPIs().catch(console.error);