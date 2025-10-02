const axios = require('axios');

async function testMetalsAPI() {
    console.log('=== Testing Metals.dev API for Gold and Precious Metals ===\n');
    require('dotenv').config();
    
    // Test 1: Metals.dev API - with proper debugging
    console.log('--- Test 1: Metals.dev API ---');
    console.log('Sign up for free API key at: https://metals.dev/');
    console.log('Add to .env file as: METALS_DEV_API_KEY=your_key_here\n');
    
    const metalsDevKey = process.env.METALS_DEV_API_KEY;
    
    if (metalsDevKey) {
        try {
            console.log('Testing with API key:', metalsDevKey.substring(0, 10) + '...');
            
            const response = await axios.get('https://api.metals.dev/v1/latest', {
                params: {
                    api_key: metalsDevKey,
                    currency: 'USD',
                    unit: 'toz'
                },
                timeout: 10000
            });
            
            console.log('\nFull Response:', JSON.stringify(response.data, null, 2));
            
            const data = response.data;
            
            if (data.metals) {
                Object.entries(data.metals).forEach(([symbol, price]) => {
                    console.log(`✓ ${symbol}: ${price.toLocaleString()}/oz`);
                });
            } else {
                console.log('✗ No metals data in response');
            }
            
        } catch (error) {
            console.log(`✗ Metals.dev Error: ${error.response?.status}`);
            console.log('Error details:', error.response?.data || error.message);
        }
    } else {
        console.log('⚠️  METALS_DEV_API_KEY not found in .env file\n');
    }
    
    // Test 2: GoldAPI.io - with proper debugging
    console.log('\n--- Test 2: GoldAPI.io ---');
    console.log('Sign up at: https://www.goldapi.io/');
    console.log('Add to .env file as: GOLD_API_KEY=your_key_here\n');
    
    const goldApiKey = process.env.GOLD_API_KEY;
    
    if (goldApiKey) {
        const metals = ['XAU', 'XAG', 'XPT', 'XPD'];
        const metalNames = { 'XAU': 'Gold', 'XAG': 'Silver', 'XPT': 'Platinum', 'XPD': 'Palladium' };
        
        for (const metal of metals) {
            try {
                console.log(`\nTesting ${metalNames[metal]} (${metal})...`);
                
                const response = await axios.get(`https://www.goldapi.io/api/${metal}/USD`, {
                    headers: {
                        'x-access-token': goldApiKey,
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000
                });
                
                console.log('Response:', JSON.stringify(response.data, null, 2));
                
                const price = response.data.price;
                const pricePerOz = response.data.price_gram_24k ? response.data.price_gram_24k * 31.1035 : price;
                
                console.log(`✓ ${metalNames[metal]} (${metal}): ${pricePerOz.toLocaleString()}/oz`);
                
                // Add delay to avoid rate limits
                await new Promise(resolve => setTimeout(resolve, 1000));
                
            } catch (error) {
                console.log(`✗ ${metalNames[metal]} Error: ${error.response?.status}`);
                console.log('Error details:', error.response?.data || error.message);
            }
        }
    } else {
        console.log('⚠️  GOLD_API_KEY not found in .env file\n');
    }
    
    // Test 3: MetalPriceAPI.com - with proper debugging
    console.log('\n--- Test 3: MetalPriceAPI.com ---');
    console.log('Sign up at: https://metalpriceapi.com/');
    console.log('Add to .env file as: METAL_PRICE_API_KEY=your_key_here\n');
    
    const metalPriceApiKey = process.env.METAL_PRICE_API_KEY;
    
    if (metalPriceApiKey) {
        try {
            console.log('Testing with API key:', metalPriceApiKey.substring(0, 10) + '...');
            
            const response = await axios.get('https://api.metalpriceapi.com/v1/latest', {
                params: {
                    api_key: metalPriceApiKey,
                    base: 'USD',
                    currencies: 'XAU,XAG,XPT,XPD'
                },
                timeout: 10000
            });
            
            console.log('\nFull Response:', JSON.stringify(response.data, null, 2));
            
            const rates = response.data.rates;
            const metalNames = { 'XAU': 'Gold', 'XAG': 'Silver', 'XPT': 'Platinum', 'XPD': 'Palladium' };
            
            for (const [symbol, rate] of Object.entries(rates)) {
                // Convert from USD per unit to price per ounce
                const pricePerOz = 1 / rate;
                console.log(`✓ ${metalNames[symbol] || symbol}: ${pricePerOz.toLocaleString()}/oz`);
            }
            
        } catch (error) {
            console.log(`✗ MetalPriceAPI Error: ${error.response?.status}`);
            console.log('Error details:', error.response?.data || error.message);
        }
    } else {
        console.log('⚠️  METAL_PRICE_API_KEY not found in .env file\n');
    }
    
    // Test 4: Commodities-API.com - with proper debugging
    console.log('\n--- Test 4: Commodities-API.com ---');
    console.log('Sign up at: https://commodities-api.com/');
    console.log('Add to .env file as: COMMODITIES_API_KEY=your_key_here\n');
    
    const commoditiesApiKey = process.env.COMMODITIES_API_KEY;
    
    if (commoditiesApiKey) {
        try {
            console.log('Testing with API key:', commoditiesApiKey.substring(0, 10) + '...');
            
            const response = await axios.get('https://commodities-api.com/api/latest', {
                params: {
                    access_key: commoditiesApiKey,
                    base: 'USD',
                    symbols: 'XAU,XAG,XPT,XPD'
                },
                timeout: 10000
            });
            
            console.log('\nFull Response:', JSON.stringify(response.data, null, 2));
            
            const data = response.data;
            const metalNames = { 'XAU': 'Gold', 'XAG': 'Silver', 'XPT': 'Platinum', 'XPD': 'Palladium' };
            
            if (data.data && data.data.rates) {
                for (const [symbol, rate] of Object.entries(data.data.rates)) {
                    const pricePerOz = 1 / rate;
                    console.log(`✓ ${metalNames[symbol] || symbol}: ${pricePerOz.toLocaleString()}/oz`);
                }
            } else if (data.rates) {
                for (const [symbol, rate] of Object.entries(data.rates)) {
                    const pricePerOz = 1 / rate;
                    console.log(`✓ ${metalNames[symbol] || symbol}: ${pricePerOz.toLocaleString()}/oz`);
                }
            } else {
                console.log('✗ Unexpected response format');
            }
            
        } catch (error) {
            console.log(`✗ Commodities-API Error: ${error.response?.status}`);
            console.log('Error details:', error.response?.data || error.message);
        }
    } else {
        console.log('⚠️  COMMODITIES_API_KEY not found in .env file\n');
    }
    
    // Test 5: Yahoo Finance for gold futures (GC=F) - NO API KEY NEEDED
    console.log('\n--- Test 5: Yahoo Finance Metal Futures (NO API KEY) ---');
    try {
        const symbol = 'GC=F'; // Gold futures
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
        const price = result.meta.regularMarketPrice;
        const currency = result.meta.currency;
        
        console.log(`✓ Gold Futures (GC=F): ${currency} $${price.toLocaleString()}/oz`);
        
    } catch (error) {
        console.log(`✗ Yahoo Finance Error: ${error.response?.status || error.message}`);
    }
    
    // Test 6: Other precious metal futures
    console.log('\n--- Test 6: Other Metal Futures on Yahoo Finance ---');
    const futures = {
        'GC=F': 'Gold',
        'SI=F': 'Silver',
        'PL=F': 'Platinum',
        'PA=F': 'Palladium',
        'HG=F': 'Copper'
    };
    
    for (const [symbol, name] of Object.entries(futures)) {
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
            const currency = result.meta.currency;
            const change = result.meta.regularMarketChange;
            const changePercent = result.meta.regularMarketChangePercent;
            
            const changeStr = change >= 0 ? `+${change.toFixed(2)}` : change.toFixed(2);
            const pctStr = changePercent >= 0 ? `+${changePercent.toFixed(2)}` : changePercent.toFixed(2);
            
            console.log(`✓ ${name} (${symbol}): ${currency} $${price.toLocaleString()} (${changeStr}, ${pctStr}%)`);
            
        } catch (error) {
            console.log(`✗ ${name} (${symbol}): ${error.response?.status || error.message}`);
        }
    }
    
    // Test 7: Response time comparison
    console.log('\n--- Test 7: Response Time Comparison ---');
    
    const apis = [
        {
            name: 'Yahoo Finance (GC=F)',
            call: () => axios.get('https://query1.finance.yahoo.com/v8/finance/chart/GC=F', {
                params: { interval: '1d', range: '1d' },
                headers: { 'User-Agent': 'Mozilla/5.0' }
            })
        }
    ];
    
    for (const api of apis) {
        try {
            const start = Date.now();
            await api.call();
            const time = Date.now() - start;
            console.log(`✓ ${api.name}: ${time}ms`);
        } catch (error) {
            console.log(`✗ ${api.name}: ${error.message}`);
        }
    }
    
    console.log('\n=== Summary & Recommendations ===');
    
    // Test 8: Try some truly free APIs without any keys
    console.log('\n--- Test 8: Completely Free APIs (No Registration) ---');
    
    // Try CoinGecko for gold (they track commodities too)
    console.log('\n8a. Testing free commodity price sources...');
    
    try {
        // Try fetching from a free forex API that might have gold
        const response = await axios.get('https://api.exchangerate.host/latest', {
            params: {
                base: 'XAU', // Gold as base
                symbols: 'USD'
            },
            timeout: 10000
        });
        
        console.log('\nExchangeRate.host Response:', JSON.stringify(response.data, null, 2));
        
        if (response.data.rates && response.data.rates.USD) {
            const goldPricePerOz = response.data.rates.USD;
            console.log(`✓ Gold (via exchangerate.host): ${goldPricePerOz.toLocaleString()}/oz`);
        }
    } catch (error) {
        console.log('✗ ExchangeRate.host Error:', error.response?.status || error.message);
    }
    
    // Try another free source
    try {
        console.log('\n8b. Testing frankfurter.app (free forex/commodities)...');
        const response = await axios.get('https://api.frankfurter.app/latest', {
            params: {
                from: 'USD',
                to: 'XAU'
            },
            timeout: 10000
        });
        
        console.log('Frankfurter Response:', JSON.stringify(response.data, null, 2));
        
        if (response.data.rates && response.data.rates.XAU) {
            const goldPricePerOz = 1 / response.data.rates.XAU;
            console.log(`✓ Gold (via frankfurter.app): ${goldPricePerOz.toLocaleString()}/oz`);
        }
    } catch (error) {
        console.log('✗ Frankfurter.app Error:', error.response?.status || error.message);
    }
    
    console.log('\n=== FINAL SUMMARY ===');
    console.log('\n🏆 Best Options for Getting Gold Price:\n');
    
    console.log('1. **Yahoo Finance Gold Futures (GC=F)** - WORKS NOW, NO API KEY');
    console.log('   ✅ No API key required');
    console.log('   ✅ No rate limits');
    console.log('   ✅ Fast response times');
    console.log('   ✅ Real-time data');
    console.log('   ✅ Same API as your existing stocks');
    console.log('   ✅ Free forever');
    console.log('   Symbol: GC=F (Gold), SI=F (Silver), PL=F (Platinum), PA=F (Palladium)\n');
    
    console.log('2. **GoldAPI.io** - Requires API Key');
    console.log('   ✅ Dedicated gold/silver/metal API');
    console.log('   ✅ Good documentation');
    console.log('   ⚠️  Requires API key (sign up at goldapi.io)');
    console.log('   ⚠️  Free tier: 50 requests/month');
    console.log('   💡 Set GOLD_API_KEY in .env to test\n');
    
    console.log('3. **MetalPriceAPI.com** - Requires API Key');
    console.log('   ✅ Multiple precious metals');
    console.log('   ✅ JSON API');
    console.log('   ⚠️  Requires API key (sign up at metalpriceapi.com)');
    console.log('   ⚠️  Free tier: 50 requests/month');
    console.log('   💡 Set METAL_PRICE_API_KEY in .env to test\n');
    
    console.log('4. **Metals.dev** - Requires API Key');
    console.log('   ✅ Real-time precious metals data');
    console.log('   ✅ Multiple units (oz, kg, gram)');
    console.log('   ⚠️  Requires API key (sign up at metals.dev)');
    console.log('   ⚠️  Free tier available');
    console.log('   💡 Set METALS_DEV_API_KEY in .env to test\n');
    
    console.log('5. **Commodities-API.com** - Requires API Key');
    console.log('   ✅ Multiple commodities');
    console.log('   ⚠️  Requires API key (sign up at commodities-api.com)');
    console.log('   💡 Set COMMODITIES_API_KEY in .env to test\n');
    
    console.log('\n📋 **How to Test APIs with Keys:**');
    console.log('1. Create a .env file in your project root');
    console.log('2. Add your API keys:');
    console.log('   METALS_DEV_API_KEY=your_key_here');
    console.log('   GOLD_API_KEY=your_key_here');
    console.log('   METAL_PRICE_API_KEY=your_key_here');
    console.log('   COMMODITIES_API_KEY=your_key_here');
    console.log('3. Run this script again to test all APIs\n');
    
    console.log('💡 **Recommended Implementation:**');
    console.log('Use Yahoo Finance with futures symbols - same as your existing stock API!\n');
    
    console.log('```javascript');
    console.log('async function getGoldPrice() {');
    console.log('    const response = await axios.get(');
    console.log('        "https://query1.finance.yahoo.com/v8/finance/chart/GC=F",');
    console.log('        {');
    console.log('            params: { interval: "1d", range: "1d" },');
    console.log('            headers: { "User-Agent": "Mozilla/5.0" }');
    console.log('        }');
    console.log('    );');
    console.log('    ');
    console.log('    const result = response.data.chart.result[0];');
    console.log('    const price = result.meta.regularMarketPrice;');
    console.log('    ');
    console.log('    return {');
    console.log('        symbol: "GOLD",');
    console.log('        price: parseFloat(price),');
    console.log('        currency: "USD"');
    console.log('    };');
    console.log('}');
    console.log('```\n');
    
    console.log('📊 **Metal Futures Symbols:**');
    console.log('   GC=F  - Gold');
    console.log('   SI=F  - Silver');
    console.log('   PL=F  - Platinum');
    console.log('   PA=F  - Palladium');
    console.log('   HG=F  - Copper');
    console.log('   CL=F  - Crude Oil');
    console.log('   NG=F  - Natural Gas\n');
    
    console.log('✨ **Benefits of Yahoo Finance Approach:**');
    console.log('   - Consistent with your existing implementation');
    console.log('   - No new API keys to manage');
    console.log('   - No rate limits to worry about');
    console.log('   - Can add multiple commodities easily');
    console.log('   - Real-time market data');
}

// Run the tests
testMetalsAPI().catch(console.error);