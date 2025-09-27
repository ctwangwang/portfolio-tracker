const axios = require('axios');

async function testYahooHK() {
    const testSymbols = ['0700', '9988', '0005', '0001'];
    
    for (const symbol of testSymbols) {
        try {
            const paddedSymbol = symbol.padStart(4, '0');
            const yahooSymbol = `${paddedSymbol}.HK`;
            
            console.log(`\nTesting ${yahooSymbol}...`);
            
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
            
            console.log(`✓ ${name}: HKD ${price}`);
        } catch (error) {
            console.log(`✗ Error: ${error.message}`);
        }
    }
}

testYahooHK();