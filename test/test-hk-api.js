require('dotenv').config();
const axios = require('axios');

async function testFinnhubAPI() {
    const apiKey = process.env.FINNHUB_API_KEY;
    console.log('Testing Finnhub API...');
    console.log('API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND');
    
    // Test 1: US Stock (should work if API key is valid)
    try {
        console.log('\n--- Test 1: US Stock (AAPL) ---');
        const response1 = await axios.get('https://finnhub.io/api/v1/quote', {
            params: {
                symbol: 'AAPL',
                token: apiKey
            }
        });
        console.log('Success:', response1.data);
    } catch (error) {
        console.log('Error:', error.response?.status, error.response?.data || error.message);
    }
    
    // Test 2: HK Stock
    try {
        console.log('\n--- Test 2: HK Stock (0700.HK - Tencent) ---');
        const response2 = await axios.get('https://finnhub.io/api/v1/quote', {
            params: {
                symbol: '0700.HK',
                token: apiKey
            }
        });
        console.log('Success:', response2.data);
    } catch (error) {
        console.log('Error:', error.response?.status, error.response?.data || error.message);
    }
}

testFinnhubAPI();