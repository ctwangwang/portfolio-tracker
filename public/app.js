const API_BASE = '/api/portfolio';

// DOM Elements - US
const addStockForm = document.getElementById('addStockForm');
const symbolInput = document.getElementById('symbol');
const quantityInput = document.getElementById('quantity');
const addStockMessage = document.getElementById('addStockMessage');

// Canada DOM Elements
const addCAStockForm = document.getElementById('addCAStockForm');
const caSymbolInput = document.getElementById('caSymbol');
const caQuantityInput = document.getElementById('caQuantity');
const addCAStockMessage = document.getElementById('addCAStockMessage');

// HK DOM Elements
const addHKStockForm = document.getElementById('addHKStockForm');
const hkSymbolInput = document.getElementById('hkSymbol');
const hkQuantityInput = document.getElementById('hkQuantity');
const addHKStockMessage = document.getElementById('addHKStockMessage');

// Taiwan DOM Elements
const addTWStockForm = document.getElementById('addTWStockForm');
const twSymbolInput = document.getElementById('twSymbol');
const twQuantityInput = document.getElementById('twQuantity');
const addTWStockMessage = document.getElementById('addTWStockMessage');

// NEW: Cash DOM Elements
const addCashForm = document.getElementById('addCashForm');
const cashCurrencyInput = document.getElementById('cashCurrency');
const cashAmountInput = document.getElementById('cashAmount');
const addCashMessage = document.getElementById('addCashMessage');

// Crypto DOM Elements
const addCryptoForm = document.getElementById('addCryptoForm');
const cryptoSymbolInput = document.getElementById('cryptoSymbol');
const cryptoQuantityInput = document.getElementById('cryptoQuantity');
const addCryptoMessage = document.getElementById('addCryptoMessage');

// Common elements
const holdingsContainer = document.getElementById('holdingsContainer');
const totalValueContainer = document.getElementById('totalValueContainer');
const refreshBtn = document.getElementById('refreshBtn');
const clearBtn = document.getElementById('clearBtn');

// Show message
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `message ${type}`;
    setTimeout(() => {
        element.className = 'message';
    }, 5000);
}

// Format currency
function formatCurrency(amount, currency) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
    }).format(amount);
}

// Add US stock
addStockForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const symbol = symbolInput.value.trim().toUpperCase();
    const quantity = parseInt(quantityInput.value);
    
    try {
        addStockMessage.textContent = 'Adding stock...';
        addStockMessage.className = 'message loading';
        
        const response = await fetch(`${API_BASE}/add/us`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ symbol, quantity })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage(addStockMessage, `Successfully added ${quantity} shares of ${symbol}!`, 'success');
            symbolInput.value = '';
            quantityInput.value = '';
            loadPortfolio();
        } else {
            showMessage(addStockMessage, `Error: ${data.error}`, 'error');
        }
    } catch (error) {
        showMessage(addStockMessage, `Error: ${error.message}`, 'error');
    }
});

// Add Canada stock
addCAStockForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const symbol = caSymbolInput.value.trim().toUpperCase();
    const quantity = parseInt(caQuantityInput.value);
    
    try {
        addCAStockMessage.textContent = 'Adding Canada stock...';
        addCAStockMessage.className = 'message loading';
        
        const response = await fetch(`${API_BASE}/add/ca`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ symbol, quantity })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage(addCAStockMessage, `Successfully added ${quantity} shares of ${symbol} (CA)!`, 'success');
            caSymbolInput.value = '';
            caQuantityInput.value = '';
            loadPortfolio();
        } else {
            showMessage(addCAStockMessage, `Error: ${data.error}`, 'error');
        }
    } catch (error) {
        showMessage(addCAStockMessage, `Error: ${error.message}`, 'error');
    }
});

// Add HK stock
addHKStockForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const symbol = hkSymbolInput.value.trim();
    const quantity = parseInt(hkQuantityInput.value);
    
    try {
        addHKStockMessage.textContent = 'Adding HK stock...';
        addHKStockMessage.className = 'message loading';
        
        const response = await fetch(`${API_BASE}/add/hk`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ symbol, quantity })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage(addHKStockMessage, `Successfully added ${quantity} shares of ${symbol} (HK)!`, 'success');
            hkSymbolInput.value = '';
            hkQuantityInput.value = '';
            loadPortfolio();
        } else {
            showMessage(addHKStockMessage, `Error: ${data.error}`, 'error');
        }
    } catch (error) {
        showMessage(addHKStockMessage, `Error: ${error.message}`, 'error');
    }
});

// Add Taiwan stock
addTWStockForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const symbol = twSymbolInput.value.trim();
    const quantity = parseInt(twQuantityInput.value);
    
    try {
        addTWStockMessage.textContent = 'Adding Taiwan stock...';
        addTWStockMessage.className = 'message loading';
        
        const response = await fetch(`${API_BASE}/add/tw`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ symbol, quantity })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage(addTWStockMessage, `Successfully added ${quantity} shares of ${symbol} (TW)!`, 'success');
            twSymbolInput.value = '';
            twQuantityInput.value = '';
            loadPortfolio();
        } else {
            showMessage(addTWStockMessage, `Error: ${data.error}`, 'error');
        }
    } catch (error) {
        showMessage(addTWStockMessage, `Error: ${error.message}`, 'error');
    }
});

// NEW: Add Cash
addCashForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const currency = cashCurrencyInput.value;
    const amount = parseFloat(cashAmountInput.value);
    
    try {
        addCashMessage.textContent = 'Adding cash...';
        addCashMessage.className = 'message loading';
        
        const response = await fetch(`${API_BASE}/add/cash`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ currency, amount })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage(addCashMessage, `Successfully added ${formatCurrency(amount, currency)}!`, 'success');
            cashCurrencyInput.value = '';
            cashAmountInput.value = '';
            loadPortfolio();
        } else {
            showMessage(addCashMessage, `Error: ${data.error}`, 'error');
        }
    } catch (error) {
        showMessage(addCashMessage, `Error: ${error.message}`, 'error');
    }
});

// Add Crypto
addCryptoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const symbol = cryptoSymbolInput.value.trim().toUpperCase();
    const quantity = parseFloat(cryptoQuantityInput.value);
    
    try {
        addCryptoMessage.textContent = 'Adding cryptocurrency...';
        addCryptoMessage.className = 'message loading';
        
        const response = await fetch(`${API_BASE}/add/crypto`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ symbol, quantity })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage(addCryptoMessage, `Successfully added ${quantity} ${symbol}!`, 'success');
            cryptoSymbolInput.value = '';
            cryptoQuantityInput.value = '';
            loadPortfolio();
        } else {
            showMessage(addCryptoMessage, `Error: ${data.error}`, 'error');
        }
    } catch (error) {
        showMessage(addCryptoMessage, `Error: ${error.message}`, 'error');
    }
});

// Load portfolio
async function loadPortfolio() {
    try {
        holdingsContainer.innerHTML = '<p class="loading">Loading portfolio...</p>';
        totalValueContainer.innerHTML = '<p class="loading">Calculating values...</p>';
        
        const response = await fetch(`${API_BASE}/value`);
        const data = await response.json();
        
        if (data.holdings && data.holdings.length > 0) {
            // Display holdings
            let holdingsHTML = `
                <table class="holdings-table">
                    <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Value</th>
                            <th>Market</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            data.holdings.forEach(holding => {
                // UPDATED: Handle cash holdings differently
                if (holding.market === 'CASH') {
                    holdingsHTML += `
                        <tr>
                            <td><strong>${holding.symbol} (Cash)</strong></td>
                            <td>-</td>
                            <td>-</td>
                            <td>${formatCurrency(holding.value, holding.currency)}</td>
                            <td>${holding.market}</td>
                            <td><button class="btn-remove" onclick="removeHolding(${data.holdings.indexOf(holding)})">🗑️</button></td>
                        </tr>
                    `;
                } else {
                    holdingsHTML += `
                        <tr>
                            <td><strong>${holding.symbol}</strong></td>
                            <td>${holding.quantity}</td>
                            <td>${formatCurrency(holding.price, holding.currency)}</td>
                            <td>${formatCurrency(holding.value, holding.currency)}</td>
                            <td>${holding.market}</td>
                            <td><button class="btn-remove" onclick="removeHolding(${data.holdings.indexOf(holding)})">🗑️</button></td>
                        </tr>
                    `;
                }
            });
            
            holdingsHTML += '</tbody></table>';
            holdingsContainer.innerHTML = holdingsHTML;
            
            // UPDATED: Display all 10 currencies (removed SGD)
            const currencies = ['USD', 'CAD', 'HKD', 'TWD', 'CNY', 'JPY', 'EUR', 'GBP', 'KRW', 'AUD'];
            let totalHTML = '<div class="currency-grid">';
            
            currencies.forEach(currency => {
                const value = data.totalValue.conversions[currency];
                if (typeof value === 'number') {
                    totalHTML += `
                        <div class="currency-item">
                            <div class="currency-code">${currency}</div>
                            <div class="currency-value">${formatCurrency(value, currency)}</div>
                        </div>
                    `;
                }
            });
            
            totalHTML += '</div>';
            totalValueContainer.innerHTML = totalHTML;
        } else {
            holdingsContainer.innerHTML = '<p class="empty-state">No holdings yet. Add your first stock above!</p>';
            totalValueContainer.innerHTML = '<p class="empty-state">Add stocks to see total value</p>';
        }
    } catch (error) {
        holdingsContainer.innerHTML = `<p class="error">Error loading portfolio: ${error.message}</p>`;
        totalValueContainer.innerHTML = `<p class="error">Error calculating values</p>`;
    }
}

// Clear portfolio
clearBtn.addEventListener('click', async () => {
    if (!confirm('Are you sure you want to clear your entire portfolio?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/clear`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showMessage(addStockMessage, 'Portfolio cleared successfully!', 'success');
            loadPortfolio();
        }
    } catch (error) {
        showMessage(addStockMessage, `Error: ${error.message}`, 'error');
    }
});

// Refresh button
refreshBtn.addEventListener('click', loadPortfolio);

// Load portfolio on page load
loadPortfolio();

// NEW: Remove individual holding
async function removeHolding(index) {
    if (!confirm('Are you sure you want to remove this holding?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/remove/${index}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage(addStockMessage, 'Holding removed successfully!', 'success');
            loadPortfolio();
        } else {
            showMessage(addStockMessage, `Error: ${data.error}`, 'error');
        }
    } catch (error) {
        showMessage(addStockMessage, `Error: ${error.message}`, 'error');
    }
}