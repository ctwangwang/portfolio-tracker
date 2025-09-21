// AllTick API Test Script (Node.js)
// Save this as 'test-alltick.js' and run with: node test-alltick.js

const https = require('https');

const TOKEN = 'c3157e6cf001e11974db300c024d3cbd-c-app';
const BASE_URL = 'https://quote.alltick.io/quote-stock-b-api';

// Helper function to make API calls
function makeAPICall(endpoint, query) {
    return new Promise((resolve, reject) => {
        const queryString = encodeURIComponent(JSON.stringify(query));
        const url = `${BASE_URL}${endpoint}?token=${TOKEN}&query=${queryString}`;
        
        console.log('\n📡 Making API call...');
        console.log('URL:', url);
        console.log('Query:', JSON.stringify(query, null, 2));
        
        https.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: parsed
                    });
                } catch (error) {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        rawData: data,
                        parseError: error.message
                    });
                }
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

// Test functions
async function testUSStock() {
    console.log('\n🇺🇸 Testing US Stock (AAPL.US)...');
    
    const query = {
        trace: `us_test_${Date.now()}`,
        data: {
            symbol_list: [{ code: "AAPL.US" }]
        }
    };
    
    try {
        const result = await makeAPICall('/trade-tick', query);
        
        console.log('\n📊 Response:');
        console.log('Status Code:', result.statusCode);
        
        if (result.data) {
            console.log('API Response:', JSON.stringify(result.data, null, 2));
            
            if (result.data.ret === 200 && result.data.data?.tick_list?.[0]) {
                const tick = result.data.data.tick_list[0];
                console.log('\n✅ SUCCESS!');
                console.log(`Symbol: ${tick.code}`);
                console.log(`Price: $${tick.price}`);
                console.log(`Volume: ${tick.volume}`);
                console.log(`Time: ${new Date(parseInt(tick.tick_time)).toLocaleString()}`);
            } else {
                console.log('\n⚠️ API responded but no valid data');
                if (result.data.ret !== 200) {
                    console.log(`Error Code: ${result.data.ret}`);
                    console.log(`Message: ${result.data.msg}`);
                }
            }
        } else {
            console.log('\n❌ Failed to parse response');
            console.log('Raw data:', result.rawData);
            console.log('Parse error:', result.parseError);
        }
    } catch (error) {
        console.log('\n❌ Request failed:', error.message);
    }
}

async function testHKStock() {
    console.log('\n🇭🇰 Testing Hong Kong Stock (700.HK - Tencent)...');
    
    const query = {
        trace: `hk_test_${Date.now()}`,
        data: {
            symbol_list: [{ code: "700.HK" }]
        }
    };
    
    try {
        const result = await makeAPICall('/trade-tick', query);
        
        console.log('\n📊 Response:');
        console.log('Status Code:', result.statusCode);
        
        if (result.data) {
            console.log('API Response:', JSON.stringify(result.data, null, 2));
            
            if (result.data.ret === 200 && result.data.data?.tick_list?.[0]) {
                const tick = result.data.data.tick_list[0];
                console.log('\n✅ SUCCESS!');
                console.log(`Symbol: ${tick.code}`);
                console.log(`Price: HK$${tick.price}`);
                console.log(`Volume: ${tick.volume}`);
                console.log(`Time: ${new Date(parseInt(tick.tick_time)).toLocaleString()}`);
            } else {
                console.log('\n⚠️ API responded but no valid data');
                if (result.data.ret !== 200) {
                    console.log(`Error Code: ${result.data.ret}`);
                    console.log(`Message: ${result.data.msg}`);
                }
            }
        } else {
            console.log('\n❌ Failed to parse response');
            console.log('Raw data:', result.rawData);
        }
    } catch (error) {
        console.log('\n❌ Request failed:', error.message);
    }
}

async function testTokenValidity() {
    console.log('\n🔑 Testing Token Validity...');
    
    // Try a simple request to see if token works
    const query = {
        trace: `token_test_${Date.now()}`,
        data: {
            symbol_list: [{ code: "AAPL.US" }]
        }
    };
    
    try {
        const result = await makeAPICall('/trade-tick', query);
        
        console.log('Status Code:', result.statusCode);
        
        if (result.statusCode === 401) {
            console.log('❌ Token is INVALID or EXPIRED');
        } else if (result.statusCode === 403) {
            console.log('❌ Token lacks permissions for this endpoint');
        } else if (result.statusCode === 429) {
            console.log('⚠️ Rate limited - too many requests');
        } else if (result.statusCode === 200) {
            console.log('✅ Token is VALID');
        } else {
            console.log(`🤔 Unexpected status: ${result.statusCode}`);
        }
        
        if (result.data) {
            console.log('Response:', JSON.stringify(result.data, null, 2));
        }
    } catch (error) {
        console.log('❌ Request failed:', error.message);
    }
}

async function testDifferentEndpoints() {
    console.log('\n🔄 Testing Different Endpoints...');
    
    const endpoints = ['/trade-tick', '/depth-tick', '/kline'];
    const query = {
        trace: `endpoint_test_${Date.now()}`,
        data: {
            symbol_list: [{ code: "AAPL.US" }]
        }
    };
    
    for (const endpoint of endpoints) {
        console.log(`\nTesting ${endpoint}...`);
        try {
            const result = await makeAPICall(endpoint, query);
            console.log(`${endpoint} - Status: ${result.statusCode}`);
            if (result.data?.ret) {
                console.log(`${endpoint} - API Code: ${result.data.ret} (${result.data.msg})`);
            }
        } catch (error) {
            console.log(`${endpoint} - Error: ${error.message}`);
        }
        
        // Wait 1 second between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

// Main test runner
async function runAllTests() {
    console.log('🚀 AllTick API Test Suite');
    console.log('========================');
    console.log(`Token: ${TOKEN}`);
    console.log(`Base URL: ${BASE_URL}`);
    
    try {
        await testTokenValidity();
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
        
        await testUSStock();
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
        
        await testHKStock();
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
        
        await testDifferentEndpoints();
        
    } catch (error) {
        console.log('\n💥 Test suite failed:', error.message);
    }
    
    console.log('\n✨ Test suite completed!');
}

// Run the tests
runAllTests();