const axios = require('axios');

async function testChinaAPIs() {
    const testSymbols = ['600519', '000858', '601318', '000001', '600036', '601288']; // Popular Chinese stocks
    
    console.log('=== Testing China Stock APIs ===\n');
    
    // Test 1: Yahoo Finance with .SS suffix (Shanghai Stock Exchange)
    console.log('--- Test 1: Yahoo Finance Shanghai (.SS suffix) ---');
    for (const symbol of testSymbols.slice(0, 3)) {
        try {
            const yahooSymbol = `${symbol}.SS`;
            
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
            console.log(`✗ ${symbol}.SS Error: ${error.response?.status || error.message}`);
        }
    }
    
    // Test 2: Yahoo Finance with .SZ suffix (Shenzhen Stock Exchange)
    console.log('\n--- Test 2: Yahoo Finance Shenzhen (.SZ suffix) ---');
    for (const symbol of testSymbols.slice(3, 6)) {
        try {
            const yahooSymbol = `${symbol}.SZ`;
            
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
            console.log(`✗ ${symbol}.SZ Error: ${error.response?.status || error.message}`);
        }
    }
    
    // Test 3: Alpha Vantage (if it supports Chinese stocks)
    console.log('\n--- Test 3: Alpha Vantage China ---');
    require('dotenv').config();
    const alphaKey = process.env.ALPHA_VANTAGE_API_KEY;
    
    if (alphaKey) {
        const testSymbol = '600519.SS';
        
        try {
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
    
    // Test 4: Finnhub with Chinese exchanges
    console.log('\n--- Test 4: Finnhub China ---');
    const finnhubKey = process.env.FINNHUB_API_KEY;
    
    if (finnhubKey) {
        for (const symbol of ['600519.SS', '000858.SZ']) {
            try {
                const response = await axios.get('https://finnhub.io/api/v1/quote', {
                    params: {
                        symbol: symbol,
                        token: finnhubKey
                    }
                });
                
                const data = response.data;
                
                if (data.c && data.c !== 0) {
                    console.log(`✓ ${symbol}: ${data.c}`);
                } else {
                    console.log(`✗ ${symbol}: No data returned`);
                }
            } catch (error) {
                console.log(`✗ ${symbol} Error: ${error.response?.status || error.message}`);
            }
        }
    } else {
        console.log('Finnhub API key not found, skipping test');
    }
    
    // Test 5: Chinese stocks on Hong Kong Exchange (H-shares)
    console.log('\n--- Test 5: Chinese H-Shares on Hong Kong Exchange ---');
    const hShares = {
        '0939': 'China Construction Bank',
        '1398': 'ICBC',
        '3988': 'Bank of China'
    };
    
    for (const [symbol, name] of Object.entries(hShares)) {
        try {
            const yahooSymbol = `${symbol}.HK`;
            
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
            const currency = result.meta.currency;
            
            console.log(`✓ ${yahooSymbol} (${name}): ${currency} ${price}`);
        } catch (error) {
            console.log(`✗ ${symbol}.HK Error: ${error.response?.status || error.message}`);
        }
    }
    
    console.log('\n=== Test Complete ===');
    console.log('\nChinese Stock Exchanges:');
    console.log('SSE (Shanghai Stock Exchange): Add .SS suffix (e.g., 600519.SS)');
    console.log('  - Symbols starting with 600/601/603/688');
    console.log('SZSE (Shenzhen Stock Exchange): Add .SZ suffix (e.g., 000858.SZ)');
    console.log('  - Symbols starting with 000/001/002/003/300');
    console.log('HKEX (H-Shares): Chinese companies on HK exchange (e.g., 0939.HK)');
    
    console.log('\nCommon Chinese Stock Symbols to test:');
    console.log('\nShanghai (600xxx, 601xxx):');
    console.log('  600519.SS - Kweichow Moutai');
    console.log('  601318.SS - Ping An Insurance');
    console.log('  600036.SS - China Merchants Bank');
    console.log('  601288.SS - Agricultural Bank of China');
    console.log('  600000.SS - Shanghai Pudong Development Bank');
    
    console.log('\nShenzhen (000xxx, 002xxx, 300xxx):');
    console.log('  000858.SZ - Wuliangye Yibin');
    console.log('  000001.SZ - Ping An Bank');
    console.log('  002594.SZ - BYD Company');
    console.log('  300750.SZ - Contemporary Amperex Technology (CATL)');
    
    console.log('\nH-Shares (Hong Kong):');
    console.log('  0939.HK - China Construction Bank');
    console.log('  1398.HK - ICBC');
    console.log('  3988.HK - Bank of China');
    console.log('  0386.HK - China Petroleum & Chemical (Sinopec)');
}

testChinaAPIs();