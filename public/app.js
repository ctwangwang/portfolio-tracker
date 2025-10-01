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

// Cash DOM Elements
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

// ========== localStorage Portfolio Management ==========
const STORAGE_KEY = 'portfolio_holdings';

// Get portfolio from localStorage
function getPortfolio() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        return [];
    }
}

// Save portfolio to localStorage
function savePortfolio(portfolio) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
    } catch (error) {
        // Silent fail - privacy first
    }
}

// NEW: Add holding with auto-merge logic
function addHolding(holding) {
    const portfolio = getPortfolio();
    
    // Check if this asset already exists
    const existingIndex = portfolio.findIndex(h => 
        h.symbol === holding.symbol && 
        h.market === holding.market
    );
    
    if (existingIndex !== -1) {
        // Asset exists - merge quantities
        const existing = portfolio[existingIndex];
        
        if (holding.market === 'CASH') {
            // For cash, add the amounts
            existing.value += holding.value;
            existing.price = existing.value; // Keep price = value for cash
        } else {
            // For stocks/crypto, add quantities and recalculate
            existing.quantity += holding.quantity;
            existing.price = holding.price; // Update to latest price
            existing.value = existing.quantity * existing.price;
        }
        
        existing.addedAt = new Date().toISOString(); // Update timestamp
        
        portfolio[existingIndex] = existing;
        savePortfolio(portfolio);
        
        return { merged: true, holding: existing };
    } else {
        // New asset - add to portfolio
        portfolio.push(holding);
        savePortfolio(portfolio);
        
        return { merged: false, holding };
    }
}

// Remove holding from portfolio
function removeHoldingAtIndex(index) {
    const portfolio = getPortfolio();
    portfolio.splice(index, 1);
    savePortfolio(portfolio);
}

// Clear portfolio
function clearPortfolio() {
    savePortfolio([]);
}

// ========== Helper Functions ==========

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

// ========== Add Stock Functions ==========

// Add US stock
addStockForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const symbol = symbolInput.value.trim().toUpperCase();
    const quantity = parseInt(quantityInput.value);
    
    try {
        addStockMessage.textContent = 'Fetching price...';
        addStockMessage.className = 'message loading';
        
        const response = await fetch(`${API_BASE}/price/us`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ symbol })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            const holding = {
                symbol: data.symbol,
                quantity: quantity,
                price: data.price,
                currency: data.currency,
                value: data.price * quantity,
                market: 'US',
                addedAt: new Date().toISOString()
            };
            
            const result = addHolding(holding);
            
            if (result.merged) {
                showMessage(addStockMessage, `✓ Merged! Now you have ${result.holding.quantity} shares of ${symbol}`, 'success');
            } else {
                showMessage(addStockMessage, `✓ Added ${quantity} shares of ${symbol}!`, 'success');
            }
            
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
        addCAStockMessage.textContent = 'Fetching price...';
        addCAStockMessage.className = 'message loading';
        
        const response = await fetch(`${API_BASE}/price/ca`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ symbol })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            const holding = {
                symbol: data.symbol,
                quantity: quantity,
                price: data.price,
                currency: data.currency,
                value: data.price * quantity,
                market: 'CA',
                addedAt: new Date().toISOString()
            };
            
            const result = addHolding(holding);
            
            if (result.merged) {
                showMessage(addCAStockMessage, `✓ Merged! Now you have ${result.holding.quantity} shares of ${symbol} (CA)`, 'success');
            } else {
                showMessage(addCAStockMessage, `✓ Added ${quantity} shares of ${symbol} (CA)!`, 'success');
            }
            
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
        addHKStockMessage.textContent = 'Fetching price...';
        addHKStockMessage.className = 'message loading';
        
        const response = await fetch(`${API_BASE}/price/hk`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ symbol })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            const holding = {
                symbol: data.symbol,
                quantity: quantity,
                price: data.price,
                currency: data.currency,
                value: data.price * quantity,
                market: 'HK',
                addedAt: new Date().toISOString()
            };
            
            const result = addHolding(holding);
            
            if (result.merged) {
                showMessage(addHKStockMessage, `✓ Merged! Now you have ${result.holding.quantity} shares of ${symbol} (HK)`, 'success');
            } else {
                showMessage(addHKStockMessage, `✓ Added ${quantity} shares of ${symbol} (HK)!`, 'success');
            }
            
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
        addTWStockMessage.textContent = 'Fetching price...';
        addTWStockMessage.className = 'message loading';
        
        const response = await fetch(`${API_BASE}/price/tw`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ symbol })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            const holding = {
                symbol: data.symbol,
                quantity: quantity,
                price: data.price,
                currency: data.currency,
                value: data.price * quantity,
                market: 'TW',
                addedAt: new Date().toISOString()
            };
            
            const result = addHolding(holding);
            
            if (result.merged) {
                showMessage(addTWStockMessage, `✓ Merged! Now you have ${result.holding.quantity} shares of ${symbol} (TW)`, 'success');
            } else {
                showMessage(addTWStockMessage, `✓ Added ${quantity} shares of ${symbol} (TW)!`, 'success');
            }
            
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

// Add Cash
addCashForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const currency = cashCurrencyInput.value;
    const amount = parseFloat(cashAmountInput.value);
    
    try {
        const holding = {
            symbol: currency.toUpperCase(),
            quantity: 1,
            price: amount,
            currency: currency.toUpperCase(),
            value: amount,
            market: 'CASH',
            addedAt: new Date().toISOString()
        };
        
        const result = addHolding(holding);
        
        if (result.merged) {
            showMessage(addCashMessage, `✓ Merged! Total ${currency.toUpperCase()} cash: ${formatCurrency(result.holding.value, currency)}`, 'success');
        } else {
            showMessage(addCashMessage, `✓ Added ${formatCurrency(amount, currency)}!`, 'success');
        }
        
        cashCurrencyInput.value = '';
        cashAmountInput.value = '';
        loadPortfolio();
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
        addCryptoMessage.textContent = 'Fetching price...';
        addCryptoMessage.className = 'message loading';
        
        const response = await fetch(`${API_BASE}/price/crypto`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ symbol })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            const holding = {
                symbol: data.symbol,
                quantity: quantity,
                price: data.price,
                currency: data.currency,
                value: data.price * quantity,
                market: 'CRYPTO',
                addedAt: new Date().toISOString()
            };
            
            const result = addHolding(holding);
            
            if (result.merged) {
                showMessage(addCryptoMessage, `✓ Merged! Now you have ${result.holding.quantity} ${symbol}`, 'success');
            } else {
                showMessage(addCryptoMessage, `✓ Added ${quantity} ${symbol}!`, 'success');
            }
            
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

// ========== Portfolio Display ==========

// Load and display portfolio
async function loadPortfolio() {
    try {
        holdingsContainer.innerHTML = '<p class="loading">Loading portfolio...</p>';
        totalValueContainer.innerHTML = '<p class="loading">Calculating values...</p>';
        
        const portfolio = getPortfolio();
        
        if (portfolio.length === 0) {
            holdingsContainer.innerHTML = '<p class="empty-state">No holdings yet. Add your first stock above!</p>';
            totalValueContainer.innerHTML = '<p class="empty-state">Add stocks to see total value</p>';
            return;
        }
        
        // Calculate total value with currency conversion
        const response = await fetch(`${API_BASE}/calculate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ holdings: portfolio })
        });
        
        const data = await response.json();
        
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
        
        portfolio.forEach((holding, index) => {
            if (holding.market === 'CASH') {
                holdingsHTML += `
                    <tr>
                        <td><strong>${holding.symbol} (Cash)</strong></td>
                        <td>-</td>
                        <td>-</td>
                        <td>${formatCurrency(holding.value, holding.currency)}</td>
                        <td>${holding.market}</td>
                        <td><button class="btn-remove" onclick="removeHolding(${index})">🗑️</button></td>
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
                        <td><button class="btn-remove" onclick="removeHolding(${index})">🗑️</button></td>
                    </tr>
                `;
            }
        });
        
        holdingsHTML += '</tbody></table>';
        holdingsContainer.innerHTML = holdingsHTML;
        
        // Display total value in multiple currencies
        const currencies = ['USD', 'CAD', 'HKD', 'TWD', 'CNY', 'JPY', 'EUR', 'GBP', 'KRW', 'AUD'];
        let totalHTML = '<div class="currency-grid">';
        
        currencies.forEach(currency => {
            const value = data.conversions[currency];
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
        
        // Add last updated timestamp
        const lastUpdated = new Date().toLocaleString();
        totalHTML += `<p style="text-align: center; color: #718096; margin-top: 16px; font-size: 14px;">Last updated: ${lastUpdated}</p>`;
        
        totalValueContainer.innerHTML = totalHTML;
        
    } catch (error) {
        holdingsContainer.innerHTML = `<p class="error">Error loading portfolio: ${error.message}</p>`;
        totalValueContainer.innerHTML = `<p class="error">Error calculating values</p>`;
    }
}

// Remove holding
function removeHolding(index) {
    if (!confirm('Are you sure you want to remove this holding?')) {
        return;
    }
    
    removeHoldingAtIndex(index);
    showMessage(addStockMessage, '✓ Holding removed!', 'success');
    loadPortfolio();
}

// Clear portfolio
clearBtn.addEventListener('click', () => {
    if (!confirm('Are you sure you want to clear your entire portfolio?')) {
        return;
    }
    
    clearPortfolio();
    showMessage(addStockMessage, '✓ Portfolio cleared!', 'success');
    loadPortfolio();
});

// Refresh button
refreshBtn.addEventListener('click', () => {
    showMessage(addStockMessage, '🔄 Refreshing prices...', 'success');
    loadPortfolio();
});

// Load portfolio on page load
window.addEventListener('DOMContentLoaded', () => {
    loadPortfolio();
});