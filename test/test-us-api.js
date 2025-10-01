const axios = require('axios');

async function testUSEquityAPIs() {
    // Popular US stocks to test
    const testSymbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX'];
    
    console.log('=== Testing US Equity APIs ===\n');
    
    // Test 1: Yahoo Finance API (what we want to switch to)
    console.log('--- Test 1: Yahoo Finance US Stocks ---');
    for (const symbol of testSymbols) {
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
            
            if (!result || !result.meta) {
                console.log(`✗ ${symbol}: No data in response`);
                continue;
            }
            
            const meta = result.meta;
            const price = meta.regularMarketPrice;
            const name = meta.longName || meta.shortName || 'Unknown';
            const currency = meta.currency || 'USD';
            const exchange = meta.exchangeName || 'Unknown';
            
            console.log(`✓ ${symbol}: ${currency} ${price} (${name}) [${exchange}]`);
            
        } catch (error) {
            console.log(`✗ ${symbol}: ${error.response?.status || error.message}`);
        }
    }
    
    // Test 2: Current Alpha Vantage API (for comparison)
    console.log('\n--- Test 2: Alpha Vantage US Stocks (Current Implementation) ---');
    require('dotenv').config();
    const alphaKey = process.env.ALPHA_VANTAGE_API_KEY;
    
    if (alphaKey) {
        for (const symbol of testSymbols.slice(0, 3)) { // Test only first 3 to avoid rate limits
            try {
                const response = await axios.get('https://www.alphavantage.co/query', {
                    params: {
                        function: 'GLOBAL_QUOTE',
                        symbol: symbol,
                        apikey: alphaKey
                    }
                });
                
                const quote = response.data['Global Quote'];
                
                if (quote && Object.keys(quote).length > 0) {
                    const price = parseFloat(quote['05. price']);
                    const symbol_returned = quote['01. symbol'];
                    console.log(`✓ ${symbol_returned}: USD ${price}`);
                } else {
                    console.log(`✗ ${symbol}: No data returned from Alpha Vantage`);
                }
                
                // Add delay to respect Alpha Vantage rate limits (free tier)
                await new Promise(resolve => setTimeout(resolve, 12000)); // 12 second delay
                
            } catch (error) {
                console.log(`✗ ${symbol}: ${error.response?.status || error.message}`);
            }
        }
    } else {
        console.log('Alpha Vantage API key not found in .env file');
    }
    
    // Test 3: Yahoo Finance - Alternative endpoint
    console.log('\n--- Test 3: Yahoo Finance Alternative Endpoint ---');
    for (const symbol of testSymbols.slice(0, 3)) {
        try {
            const response = await axios.get(
                `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${symbol}`,
                {
                    params: {
                        modules: 'price'
                    },
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                }
            );
            
            const result = response.data.quoteSummary.result[0];
            const priceData = result.price;
            
            const price = priceData.regularMarketPrice.raw;
            const currency = priceData.currency;
            const shortName = priceData.shortName;
            
            console.log(`✓ ${symbol}: ${currency} ${price} (${shortName})`);
            
        } catch (error) {
            console.log(`✗ ${symbol}: ${error.response?.status || error.message}`);
        }
    }
    
    // Test 4: Yahoo Finance - Simple quote endpoint
    console.log('\n--- Test 4: Yahoo Finance Simple Quote Endpoint ---');
    try {
        const symbolsStr = testSymbols.slice(0, 5).join(',');
        const response = await axios.get(
            `https://query1.finance.yahoo.com/v7/finance/quote`,
            {
                params: {
                    symbols: symbolsStr
                },
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            }
        );
        
        const quotes = response.data.quoteResponse.result;
        
        quotes.forEach(quote => {
            const symbol = quote.symbol;
            const price = quote.regularMarketPrice;
            const name = quote.shortName || quote.longName;
            const currency = quote.currency;
            
            console.log(`✓ ${symbol}: ${currency} ${price} (${name})`);
        });
        
    } catch (error) {
        console.log(`✗ Bulk quote error: ${error.response?.status || error.message}`);
    }
    
    console.log('\n=== Performance Comparison ===');
    
    // Test response time comparison
    console.log('\n--- Response Time Test ---');
    const testSymbol = 'AAPL';
    
    // Yahoo Finance timing
    const yahooStart = Date.now();
    try {
        await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${testSymbol}`, {
            params: { interval: '1d', range: '1d' },
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const yahooTime = Date.now() - yahooStart;
        console.log(`Yahoo Finance: ${yahooTime}ms`);
    } catch (error) {
        console.log(`Yahoo Finance: Error - ${error.message}`);
    }
    
    // Alpha Vantage timing (if key available)
    if (alphaKey) {
        const alphaStart = Date.now();
        try {
            await axios.get('https://www.alphavantage.co/query', {
                params: {
                    function: 'GLOBAL_QUOTE',
                    symbol: testSymbol,
                    apikey: alphaKey
                }
            });
            const alphaTime = Date.now() - alphaStart;
            console.log(`Alpha Vantage: ${alphaTime}ms`);
        } catch (error) {
            console.log(`Alpha Vantage: Error - ${error.message}`);
        }
    }
    
    console.log('\n=== Test Summary ===');
    console.log('✅ Yahoo Finance Advantages:');
    console.log('   - No API key required');
    console.log('   - No rate limits (within reason)');
    console.log('   - Fast response times');
    console.log('   - Multiple endpoints available');
    console.log('   - Real-time data');
    console.log('   - Same API works for US, HK, TW, CA stocks');
    
    console.log('\n⚠️  Yahoo Finance Considerations:');
    console.log('   - Unofficial API (could change)');
    console.log('   - Requires User-Agent header');
    console.log('   - May have usage limits (undocumented)');
    
    console.log('\n📊 Alpha Vantage (Current):');
    console.log('   - Official API with documentation');
    console.log('   - Rate limited (5 calls/minute on free tier)');
    console.log('   - Requires API key management');
    console.log('   - More expensive for higher usage');
    
    console.log('\n🎯 Recommendation:');
    console.log('   Use Yahoo Finance chart endpoint: /v8/finance/chart/{symbol}');
    console.log('   - Most reliable and consistent');
    console.log('   - Works for all markets (US, CA, HK, TW)');
    console.log('   - Fast and no API key needed');
}

// Helper function to format the new Yahoo Finance method
function demonstrateNewUSStockMethod() {
    console.log('\n=== New US Stock Method Implementation ===');
    console.log(`
async function getUSStockPrice(symbol) {
    try {
        const response = await axios.get(
            \`https://query1.finance.yahoo.com/v8/finance/chart/\${symbol}\`,
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
            throw new Error(\`No data found for symbol: \${symbol}\`);
        }

        return {
            symbol: result.meta.symbol || symbol,
            price: parseFloat(result.meta.regularMarketPrice),
            currency: result.meta.currency || 'USD'
        };
    } catch (error) {
        if (error.response?.status === 404) {
            throw new Error(\`Stock symbol \${symbol} not found. Please check the symbol.\`);
        }
        throw new Error(\`Failed to fetch US stock price for \${symbol}: \${error.message}\`);
    }
}
    `);
}

// Run the tests
testUSEquityAPIs().then(() => {
    demonstrateNewUSStockMethod();
}).catch(console.error);