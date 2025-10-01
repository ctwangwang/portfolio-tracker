const axios = require('axios');

async function testCanadaAPIs() {
    const testSymbols = ['SHOP', 'TD', 'RY', 'ENB', 'BMO', 'CNQ']; // Popular Canadian stocks
    
    console.log('=== Testing Canada Stock APIs ===\n');
    
    // Test 1: Yahoo Finance with .TO suffix (Toronto Stock Exchange)
    console.log('--- Test 1: Yahoo Finance Canada (.TO suffix) ---');
    for (const symbol of testSymbols) {
        try {
            const yahooSymbol = `${symbol}.TO`;
            
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
            console.log(`✗ ${symbol}.TO Error: ${error.response?.status || error.message}`);
        }
    }
    
    // Test 2: Alpha Vantage (if it supports Canadian stocks)
    console.log('\n--- Test 2: Alpha Vantage Canada ---');
    require('dotenv').config();
    const alphaKey = process.env.ALPHA_VANTAGE_API_KEY;
    
    if (alphaKey) {
        const testSymbol = 'SHOP.TO';
        
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
    
    // Test 3: Finnhub with Toronto Stock Exchange
    console.log('\n--- Test 3: Finnhub Canada ---');
    const finnhubKey = process.env.FINNHUB_API_KEY;
    
    if (finnhubKey) {
        for (const symbol of ['SHOP', 'TD']) {
            try {
                const finnhubSymbol = `${symbol}.TO`;
                
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
                console.log(`✗ ${symbol}.TO Error: ${error.response?.status || error.message}`);
            }
        }
    } else {
        console.log('Finnhub API key not found, skipping test');
    }
    
    // Test 4: TSX Venture Exchange (.V suffix)
    console.log('\n--- Test 4: Yahoo Finance TSX Venture (.V suffix) ---');
    const ventureSymbols = ['NILI', 'GPG', 'PRL']; // TSX Venture examples
    
    for (const symbol of ventureSymbols) {
        try {
            const yahooSymbol = `${symbol}.V`;
            
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
            console.log(`✗ ${symbol}.V Error: ${error.response?.status || error.message}`);
        }
    }
    
    // Test 5: Canadian stocks listed on US exchanges (no suffix needed)
    console.log('\n--- Test 5: Canadian Companies on US Exchanges (No suffix) ---');
    const usListedCA = ['SHOP', 'BB', 'LULU']; // Shopify, BlackBerry, Lululemon on NYSE/NASDAQ
    
    for (const symbol of usListedCA) {
        try {
            const response = await axios.get(
                `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`,
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
            
            console.log(`✓ ${symbol} (${name}): ${currency} ${price}`);
        } catch (error) {
            console.log(`✗ ${symbol} Error: ${error.response?.status || error.message}`);
        }
    }
    
    console.log('\n=== Test Complete ===');
    console.log('\nCanadian Stock Exchanges:');
    console.log('TSX (Toronto Stock Exchange): Add .TO suffix (e.g., SHOP.TO, TD.TO)');
    console.log('TSXV (TSX Venture Exchange): Add .V suffix (e.g., NILI.V)');
    console.log('US-listed Canadian companies: No suffix needed (e.g., SHOP, BB)');
    
    console.log('\nCommon Canadian Stock Symbols to test:');
    console.log('TSX Stocks (.TO):');
    console.log('  SHOP.TO - Shopify');
    console.log('  TD.TO - Toronto-Dominion Bank');
    console.log('  RY.TO - Royal Bank of Canada');
    console.log('  ENB.TO - Enbridge');
    console.log('  BMO.TO - Bank of Montreal');
    console.log('  CNQ.TO - Canadian Natural Resources');
    console.log('  CP.TO - Canadian Pacific Railway');
    console.log('  SU.TO - Suncor Energy');
    console.log('  BAM.TO - Brookfield Asset Management');
    console.log('  CNR.TO - Canadian National Railway');
    
    console.log('\nTSXV Stocks (.V):');
    console.log('  NILI.V - Nevada Lithium');
    console.log('  GPG.V - Grande Portage Resources');
    console.log('  PRL.V - Pacton Gold');
}

testCanadaAPIs();