const axios = require('axios');

async function testJapanAPIs() {
    // Popular Japanese stocks to test
    const testSymbols = [
        { symbol: '7203', name: 'Toyota Motor' },
        { symbol: '6758', name: 'Sony Group' },
        { symbol: '9984', name: 'SoftBank Group' },
        { symbol: '6861', name: 'Keyence' },
        { symbol: '4063', name: 'Shin-Etsu Chemical' },
        { symbol: '8306', name: 'Mitsubishi UFJ Financial' },
        { symbol: '7974', name: 'Nintendo' },
        { symbol: '6981', name: 'Murata Manufacturing' }
    ];
    
    console.log('=== Testing Japanese Stock APIs ===\n');
    console.log('Japanese Stock Market Info:');
    console.log('- Tokyo Stock Exchange (TSE): Primary market');
    console.log('- Trading hours: 9:00-11:30, 12:30-15:00 JST');
    console.log('- Currency: Japanese Yen (JPY)');
    console.log('- Typical symbols: 4-digit numbers (e.g., 7203, 6758)\n');
    
    // Test 1: Yahoo Finance with .T suffix (Tokyo Stock Exchange)
    console.log('--- Test 1: Yahoo Finance Tokyo (.T suffix) ---');
    for (const stock of testSymbols) {
        try {
            const yahooSymbol = `${stock.symbol}.T`;
            
            const response = await axios.get(
                `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}`,
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
            const price = result.meta.regularMarketPrice;
            const name = result.meta.longName || result.meta.shortName || stock.name;
            const currency = result.meta.currency;
            const marketState = result.meta.marketState;
            
            console.log(`✓ ${yahooSymbol} (${name}): ${currency} ${price.toLocaleString()} [${marketState}]`);
        } catch (error) {
            console.log(`✗ ${stock.symbol}.T Error: ${error.response?.status || error.message}`);
        }
    }
    
    // Test 2: Yahoo Finance alternative - some Japanese stocks might have different suffixes
    console.log('\n--- Test 2: Yahoo Finance Alternative Suffixes ---');
    const alternativeSuffixes = ['.TYO', '.TO']; // Sometimes used for Tokyo
    
    for (const suffix of alternativeSuffixes) {
        console.log(`\nTesting with ${suffix} suffix:`);
        for (const stock of testSymbols.slice(0, 3)) { // Test first 3 stocks
            try {
                const yahooSymbol = `${stock.symbol}${suffix}`;
                
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
                
                console.log(`✓ ${yahooSymbol} (${name}): JPY ${price}`);
            } catch (error) {
                console.log(`✗ ${stock.symbol}${suffix} Error: ${error.response?.status || error.message}`);
            }
        }
    }
    
    // Test 3: Alpha Vantage (if it supports Japanese stocks)
    console.log('\n--- Test 3: Alpha Vantage Japan ---');
    require('dotenv').config();
    const alphaKey = process.env.ALPHA_VANTAGE_API_KEY;
    
    if (alphaKey) {
        const testStock = testSymbols[0]; // Toyota
        const testSymbol = `${testStock.symbol}.T`;
        
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
    
    // Test 4: Finnhub with Japanese stocks
    console.log('\n--- Test 4: Finnhub Japan ---');
    const finnhubKey = process.env.FINNHUB_API_KEY;
    
    if (finnhubKey) {
        for (const stock of testSymbols.slice(0, 3)) {
            try {
                const finnhubSymbol = `${stock.symbol}.T`;
                
                const response = await axios.get('https://finnhub.io/api/v1/quote', {
                    params: {
                        symbol: finnhubSymbol,
                        token: finnhubKey
                    }
                });
                
                const data = response.data;
                
                if (data.c && data.c !== 0) {
                    console.log(`✓ ${finnhubSymbol} (${stock.name}): JPY ${data.c}`);
                } else {
                    console.log(`✗ ${finnhubSymbol}: No data returned`);
                }
            } catch (error) {
                console.log(`✗ ${stock.symbol}.T Error: ${error.response?.status || error.message}`);
            }
        }
    } else {
        console.log('Finnhub API key not found, skipping test');
    }
    
    // Test 5: Test some ADR (American Depositary Receipts) of Japanese companies
    console.log('\n--- Test 5: Japanese ADRs on US Markets ---');
    const japaneseADRs = [
        { symbol: 'TM', name: 'Toyota Motor ADR', original: '7203' },
        { symbol: 'SONY', name: 'Sony Group ADR', original: '6758' },
        { symbol: 'NTDOY', name: 'Nintendo ADR', original: '7974' },
        { symbol: 'SFTBY', name: 'SoftBank ADR', original: '9984' }
    ];
    
    for (const adr of japaneseADRs) {
        try {
            const response = await axios.get(
                `https://query1.finance.yahoo.com/v8/finance/chart/${adr.symbol}`,
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
            const exchange = result.meta.exchangeName;
            
            console.log(`✓ ${adr.symbol} (${adr.name}): ${currency} ${price} [${exchange}] (JP: ${adr.original})`);
        } catch (error) {
            console.log(`✗ ${adr.symbol} Error: ${error.response?.status || error.message}`);
        }
    }
    
    // Test 6: Test market timing and trading hours
    console.log('\n--- Test 6: Market Status and Trading Hours ---');
    try {
        const response = await axios.get(
            'https://query1.finance.yahoo.com/v8/finance/chart/7203.T',
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
        const meta = result.meta;
        
        console.log(`Market State: ${meta.marketState}`);
        console.log(`Exchange Name: ${meta.exchangeName}`);
        console.log(`Exchange Timezone: ${meta.exchangeTimezoneName}`);
        console.log(`Current Trading Period: ${meta.currentTradingPeriod?.regular?.start ? 
            new Date(meta.currentTradingPeriod.regular.start * 1000).toLocaleString() : 'N/A'} - ${
            meta.currentTradingPeriod?.regular?.end ? 
            new Date(meta.currentTradingPeriod.regular.end * 1000).toLocaleString() : 'N/A'}`);
        
    } catch (error) {
        console.log(`✗ Market status error: ${error.message}`);
    }
    
    // Test 7: Bulk quote test for Japanese stocks
    console.log('\n--- Test 7: Bulk Quote Test ---');
    try {
        const symbols = testSymbols.slice(0, 4).map(s => `${s.symbol}.T`).join(',');
        
        const response = await axios.get(
            'https://query1.finance.yahoo.com/v7/finance/quote',
            {
                params: {
                    symbols: symbols
                },
                headers: {
                    'User-Agent': 'Mozilla/5.0'
                }
            }
        );
        
        const quotes = response.data.quoteResponse.result;
        
        quotes.forEach(quote => {
            const symbol = quote.symbol;
            const price = quote.regularMarketPrice;
            const name = quote.shortName || quote.longName;
            const currency = quote.currency;
            const marketState = quote.marketState;
            
            console.log(`✓ ${symbol} (${name}): ${currency} ${price} [${marketState}]`);
        });
        
    } catch (error) {
        console.log(`✗ Bulk quote error: ${error.response?.status || error.message}`);
    }
    
    // Test 8: Response time test
    console.log('\n--- Test 8: Response Time Test ---');
    const testSymbol = '7203.T'; // Toyota
    
    const start = Date.now();
    try {
        await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${testSymbol}`, {
            params: { interval: '1d', range: '1d' },
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const time = Date.now() - start;
        console.log(`Yahoo Finance Japan: ${time}ms`);
    } catch (error) {
        console.log(`Yahoo Finance Japan: Error - ${error.message}`);
    }
    
    console.log('\n=== Test Complete ===');
    console.log('\nJapanese Stock Market Summary:');
    console.log('📍 Primary Exchange: Tokyo Stock Exchange (TSE)');
    console.log('💱 Currency: Japanese Yen (JPY)');
    console.log('🕘 Trading Hours: 9:00-11:30, 12:30-15:00 JST (with lunch break)');
    console.log('📊 Symbol Format: 4-digit numbers + .T suffix (e.g., 7203.T)');
    
    console.log('\n🎯 Popular Japanese Stock Symbols:');
    console.log('Major Companies (.T suffix):');
    testSymbols.forEach(stock => {
        console.log(`  ${stock.symbol}.T - ${stock.name}`);
    });
    
    console.log('\nJapanese ADRs (US markets, USD currency):');
    japaneseADRs.forEach(adr => {
        console.log(`  ${adr.symbol} - ${adr.name} (JP: ${adr.original})`);
    });
    
    console.log('\n🔧 Implementation Notes:');
    console.log('✅ Use Yahoo Finance with .T suffix for direct Japanese stocks');
    console.log('✅ Returns prices in JPY (Japanese Yen)');
    console.log('✅ Same API pattern as other markets (HK, TW, CA)');
    console.log('⚠️  Japanese market has lunch break (11:30-12:30 JST)');
    console.log('⚠️  Consider timezone differences for real-time data');
    
    console.log('\n💡 Recommended Implementation:');
    console.log('1. Add .T suffix to user input (e.g., "7203" → "7203.T")');
    console.log('2. Use same Yahoo Finance endpoint as other markets');
    console.log('3. Currency will be JPY');
    console.log('4. Add JPY to your currency conversion service');
    
    console.log('\n📈 Market Categories:');
    console.log('Nikkei 225: Major Japanese companies');
    console.log('TOPIX: Broader market index');
    console.log('Growth stocks: Tech and innovation companies');
    console.log('Value stocks: Traditional industrial companies');
    
    console.log('\n🏢 Major Sectors:');
    console.log('- Automotive: Toyota (7203), Honda (7267), Nissan (7201)');
    console.log('- Technology: Sony (6758), Nintendo (7974), Keyence (6861)');
    console.log('- Finance: MUFG (8306), SMFG (8316), Mizuho (8411)');
    console.log('- Telecom: NTT (9432), SoftBank (9984), KDDI (9433)');
    console.log('- Retail: Fast Retailing/Uniqlo (9983), Seven & i (3382)');
}

// Helper function to demonstrate the implementation
function demonstrateJPStockMethod() {
    console.log('\n=== Recommended Japanese Stock Implementation ===');
    console.log(`
async function getJPStockPrice(symbol) {
    try {
        // Format Japan stock symbol for Yahoo Finance
        // User enters just the symbol (e.g., "7203"), add .T for Tokyo Stock Exchange
        let formattedSymbol = symbol;
        
        if (!symbol.includes('.T')) {
            formattedSymbol = \`\${symbol}.T\`;
        }
        
        const response = await axios.get(
            \`https://query1.finance.yahoo.com/v8/finance/chart/\${formattedSymbol}\`,
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
        
        if (!result || !result.meta || !result.meta.regularMarketPrice) {
            throw new Error(\`No data found for Japan symbol: \${symbol}\`);
        }

        const price = result.meta.regularMarketPrice;
        
        return {
            symbol: symbol, // Return original symbol without .T
            price: parseFloat(price),
            currency: 'JPY'
        };
    } catch (error) {
        if (error.response?.status === 404) {
            throw new Error(\`Stock symbol \${symbol} not found. Please check the symbol.\`);
        }
        throw new Error(\`Failed to fetch Japan stock price for \${symbol}: \${error.message}\`);
    }
}
    `);
}

// Run the tests
testJapanAPIs().then(() => {
    demonstrateJPStockMethod();
}).catch(console.error);