const axios = require('axios');

async function testTaiwanAPIs() {
    const testSymbols = ['2330', '2317', '2454', '2303']; // TSMC, Hon Hai, MediaTek, UMC
    
    console.log('=== Testing Taiwan Stock APIs ===\n');
    
    // Test 1: Yahoo Finance (similar to HK)
    console.log('--- Test 1: Yahoo Finance Taiwan ---');
    for (const symbol of testSymbols) {
        try {
            const yahooSymbol = `${symbol}.TW`;
            
            const response = await axios.get(
                `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}`,
                {
                    params: {
                        interval: '1d',
                        range: '1d'
                    },
                    headers: {
                        'User-Agent': 'Mozilla/5.0'
                    }
                }
            );
            
            const result = response.data.chart.result[0];
            const price = result.meta.regularMarketPrice;
            const name = result.meta.longName || result.meta.shortName;
            const currency = result.meta.currency;
            
            console.log(`✓ ${yahooSymbol} (${name}): ${currency} ${price}`);
        } catch (error) {
            console.log(`✗ ${symbol}.TW Error: ${error.response?.status || error.message}`);
        }
    }
    
    // Test 2: Yahoo Finance with .TWO suffix (alternative)
    console.log('\n--- Test 2: Yahoo Finance Taiwan (.TWO suffix) ---');
    for (const symbol of testSymbols) {
        try {
            const yahooSymbol = `${symbol}.TWO`;
            
            const response = await axios.get(
                `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}`,
                {
                    params: {
                        interval: '1d',
                        range: '1d'
                    },
                    headers: {
                        'User-Agent': 'Mozilla/5.0'
                    }
                }
            );
            
            const result = response.data.chart.result[0];
            const price = result.meta.regularMarketPrice;
            const name = result.meta.longName || result.meta.shortName;
            const currency = result.meta.currency;
            
            console.log(`✓ ${yahooSymbol} (${name}): ${currency} ${price}`);
        } catch (error) {
            console.log(`✗ ${symbol}.TWO Error: ${error.response?.status || error.message}`);
        }
    }
    
    // Test 3: Finnhub (if your key works)
    console.log('\n--- Test 3: Finnhub Taiwan ---');
    require('dotenv').config();
    const finnhubKey = process.env.FINNHUB_API_KEY;
    
    if (finnhubKey) {
        for (const symbol of testSymbols) {
            try {
                const finnhubSymbol = `${symbol}.TW`;
                
                const response = await axios.get('https://finnhub.io/api/v1/quote', {
                    params: {
                        symbol: finnhubSymbol,
                        token: finnhubKey
                    }
                });
                
                const data = response.data;
                
                if (data.c && data.c !== 0) {
                    console.log(`✓ ${finnhubSymbol}: ${data.c}`);
                } else {
                    console.log(`✗ ${finnhubSymbol}: No data returned`);
                }
            } catch (error) {
                console.log(`✗ ${symbol}.TW Error: ${error.response?.status || error.message}`);
            }
        }
    } else {
        console.log('Finnhub API key not found, skipping test');
    }
    
    // Test 4: Alpha Vantage (if it supports TW stocks)
    console.log('\n--- Test 4: Alpha Vantage Taiwan ---');
    const alphaKey = process.env.ALPHA_VANTAGE_API_KEY;
    
    if (alphaKey) {
        try {
            const testSymbol = '2330.TW';
            
            const response = await axios.get('https://www.alphavantage.co/query', {
                params: {
                    function: 'GLOBAL_QUOTE',
                    symbol: testSymbol,
                    apikey: alphaKey
                }
            });
            
            const quote = response.data['Global Quote'];
            
            if (quote && Object.keys(quote).length > 0) {
                console.log(`✓ ${testSymbol}: ${quote['05. price']}`);
            } else {
                console.log(`✗ ${testSymbol}: No data returned`);
            }
        } catch (error) {
            console.log(`✗ Alpha Vantage Error: ${error.message}`);
        }
    } else {
        console.log('Alpha Vantage API key not found, skipping test');
    }
    
    console.log('\n=== Test Complete ===');
    console.log('\nCommon Taiwan Stock Codes:');
    console.log('2330 - TSMC (Taiwan Semiconductor)');
    console.log('2317 - Hon Hai Precision (Foxconn)');
    console.log('2454 - MediaTek');
    console.log('2303 - United Microelectronics (UMC)');
    console.log('2412 - Chunghwa Telecom');
    console.log('2882 - Cathay Financial');
}

testTaiwanAPIs();