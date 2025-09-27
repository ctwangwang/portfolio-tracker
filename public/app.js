const API_BASE = '/api/portfolio';

// DOM Elements - Existing
const addStockForm = document.getElementById('addStockForm');
const symbolInput = document.getElementById('symbol');
const quantityInput = document.getElementById('quantity');
const addStockMessage = document.getElementById('addStockMessage');

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

// NEW: Crypto DOM Elements
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

// Add US stock (unchanged)
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

// Add HK stock (unchanged)
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

// Add Taiwan stock (unchanged)
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

// NEW: Add Crypto
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

// Load portfolio (unchanged)
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
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            data.holdings.forEach(holding => {
                holdingsHTML += `
                    <tr>
                        <td><strong>${holding.symbol}</strong></td>
                        <td>${holding.quantity}</td>
                        <td>${formatCurrency(holding.price, holding.currency)}</td>
                        <td>${formatCurrency(holding.value, holding.currency)}</td>
                        <td>${holding.market}</td>
                    </tr>
                `;
            });
            
            holdingsHTML += '</tbody></table>';
            holdingsContainer.innerHTML = holdingsHTML;
            
            // Display total values in multiple currencies
            const currencies = ['USD', 'CAD', 'HKD', 'TWD', 'CNY', 'JPY'];
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

// Clear portfolio (unchanged)
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

// Refresh button (unchanged)
refreshBtn.addEventListener('click', loadPortfolio);

// Load portfolio on page load (unchanged)
loadPortfolio();