import React, { useState, useEffect, useCallback } from 'react';
import { PlusCircle, Search, DollarSign, TrendingUp, Eye, EyeOff, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import './App.css'; // We'll create this CSS file

// Types
interface Stock {
  id: string;
  symbol: string;
  shares: number;
  market: 'US' | 'HK' | 'TW';
  currentPrice: number;
  currency: string;
  lastUpdated: string;
  name?: string;
  change24h?: number;
  changePercent?: number;
}

interface Cash {
  id: string;
  currency: string;
  amount: number;
}

interface ExchangeRates {
  [key: string]: number;
}

interface SearchResult {
  symbol: string;
  name: string;
  market: string;
}

// API Configuration - Using Local Proxy Server
const API_CONFIG = {
  PROXY_BASE_URL: 'http://localhost:3001', // Your proxy server
  UPDATE_INTERVAL: 60000, // 1 minute
  RATE_LIMIT_DELAY: 2000, // 2 seconds between calls
};

// Stock APIs using proxy server
const stockAPIs = {
  US: async (symbol: string) => {
    console.log(`Fetching US stock via proxy: ${symbol}`);
    
    try {
      const response = await fetch(`${API_CONFIG.PROXY_BASE_URL}/api/stock/us/${symbol}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('US API response:', data);
      
      if (data.price) {
        return {
          price: data.price,
          currency: 'USD',
          name: data.name || symbol,
          lastUpdated: data.lastUpdated,
          change24h: data.change24h,
          changePercent: data.changePercent
        };
      }
      
      throw new Error('No price data received from proxy');
    } catch (error: any) {
      console.error(`Failed to fetch US stock ${symbol}:`, error);
      
      // Enhanced fallback with realistic mock prices
      const mockPrices: { [key: string]: number } = {
        'AAPL': 178.25,
        'TSLA': 251.50,
        'GOOGL': 138.75,
        'MSFT': 415.30,
        'NVDA': 875.60,
        'AMZN': 155.20,
        'META': 485.90,
        'NFLX': 425.10,
        'AMD': 142.35,
        'PLTR': 28.45
      };
      
      return {
        price: mockPrices[symbol.toUpperCase()] || (Math.random() * 200 + 50),
        currency: 'USD',
        name: `${symbol} (Mock Data - Proxy Error)`,
        lastUpdated: new Date().toISOString(),
        change24h: (Math.random() - 0.5) * 10,
        changePercent: (Math.random() - 0.5) * 5
      };
    }
  },

  HK: async (symbol: string) => {
    console.log(`Fetching HK stock via proxy: ${symbol}`);
    
    try {
      const response = await fetch(`${API_CONFIG.PROXY_BASE_URL}/api/stock/hk/${symbol}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('HK API response:', data);
      
      if (data.price) {
        return {
          price: data.price,
          currency: 'HKD',
          name: data.name || symbol,
          lastUpdated: data.lastUpdated,
          change24h: data.change24h,
          changePercent: data.changePercent
        };
      }
      
      throw new Error('No price data received from proxy');
    } catch (error: any) {
      console.error(`Failed to fetch HK stock ${symbol}:`, error);
      
      // Enhanced fallback with realistic HK stock prices
      const mockPrices: { [key: string]: number } = {
        '00700': 312.40, // Tencent
        '00939': 6.85,   // CCB
        '00941': 58.20,  // China Mobile
        '00005': 65.50,  // HSBC
        '01398': 3.95,   // ICBC
        '02318': 48.75,  // Ping An
        '03690': 285.60, // Meituan
        '09988': 78.90   // Alibaba HK
      };
      
      return {
        price: mockPrices[symbol] || (Math.random() * 300 + 50),
        currency: 'HKD',
        name: `${symbol} (Mock Data - Proxy Error)`,
        lastUpdated: new Date().toISOString(),
        change24h: (Math.random() - 0.5) * 15,
        changePercent: (Math.random() - 0.5) * 3
      };
    }
  },

  TW: async (symbol: string) => {
    console.log(`Fetching TW stock via proxy: ${symbol}`);
    
    try {
      const response = await fetch(`${API_CONFIG.PROXY_BASE_URL}/api/stock/tw/${symbol}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('TW API response:', data);
      
      if (data.price) {
        return {
          price: data.price,
          currency: 'TWD',
          name: data.name || symbol,
          lastUpdated: data.lastUpdated,
          change24h: data.change24h,
          changePercent: data.changePercent
        };
      }
      
      throw new Error('No price data received from proxy');
    } catch (error: any) {
      console.error(`Failed to fetch TW stock ${symbol}:`, error);
      
      // Enhanced fallback with realistic Taiwan stock prices
      const mockPrices: { [key: string]: number } = {
        '2330': 568.00, // TSMC
        '2454': 1285.00, // MediaTek
        '2317': 115.50,  // Hon Hai
        '2882': 58.40,   // Cathay Financial
        '2412': 95.20,   // Chunghwa Telecom
        '1303': 28.75,   // Nan Ya Plastics
        '2308': 458.50,  // Delta Electronics
        '6505': 675.00   // Taiwan Mobile
      };
      
      return {
        price: mockPrices[symbol] || (Math.random() * 500 + 100),
        currency: 'TWD',
        name: `${symbol} (Mock Data - Proxy Error)`,
        lastUpdated: new Date().toISOString(),
        change24h: (Math.random() - 0.5) * 20,
        changePercent: (Math.random() - 0.5) * 4
      };
    }
  }
};

// Stock Search APIs using proxy server
const searchAPIs = {
  US: async (query: string): Promise<SearchResult[]> => {
    if (!query || query.length < 1) return [];
    
    try {
      const response = await fetch(`${API_CONFIG.PROXY_BASE_URL}/api/search/us/${encodeURIComponent(query)}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('US search error:', error);
    }
    
    // Fallback search logic
    const upperQuery = query.toUpperCase();
    if (/^[A-Z]{1,5}$/.test(upperQuery)) {
      return [{
        symbol: upperQuery,
        name: `${upperQuery} (US Stock)`,
        market: 'US'
      }];
    }
    return [];
  },

  HK: async (query: string): Promise<SearchResult[]> => {
    if (!query || query.length < 1) return [];
    
    try {
      const response = await fetch(`${API_CONFIG.PROXY_BASE_URL}/api/search/hk/${encodeURIComponent(query)}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('HK search error:', error);
    }
    
    // Fallback search logic
    let formattedQuery = query.trim();
    if (/^\d+$/.test(formattedQuery)) {
      formattedQuery = formattedQuery.padStart(5, '0');
    }
    
    if (/^\d{5}$/.test(formattedQuery)) {
      return [{
        symbol: formattedQuery,
        name: `${formattedQuery} (HK Stock)`,
        market: 'HK'
      }];
    }
    return [];
  },

  TW: async (query: string): Promise<SearchResult[]> => {
    if (!query || query.length < 1) return [];
    
    try {
      const response = await fetch(`${API_CONFIG.PROXY_BASE_URL}/api/search/tw/${encodeURIComponent(query)}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('TW search error:', error);
    }
    
    // Fallback search logic
    if (/^\d{4}$/.test(query.trim())) {
      return [{
        symbol: query.trim(),
        name: `${query.trim()} (TW Stock)`,
        market: 'TW'
      }];
    }
    return [];
  }
};

// Currency Exchange API using proxy server
const getCurrencyRates = async (): Promise<ExchangeRates> => {
  try {
    console.log('Fetching currency rates via proxy');
    const response = await fetch(`${API_CONFIG.PROXY_BASE_URL}/api/currency`);
    
    if (response.ok) {
      const data = await response.json();
      if (data.rates) {
        return data.rates;
      }
    }
  } catch (error) {
    console.error('Currency API error via proxy:', error);
  }
  
  // Fallback mock rates
  return {
    USD: 1,
    CAD: 1.35,
    HKD: 7.8,
    TWD: 31.5,
    CNY: 7.2,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 150
  };
};

// Enhanced real-time updates with proxy server
const useRealTimeUpdates = (stocks: Stock[], setStocks: React.Dispatch<React.SetStateAction<Stock[]>>, setExchangeRates: React.Dispatch<React.SetStateAction<ExchangeRates>>) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastApiCall, setLastApiCall] = useState<Date | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [proxyStatus, setProxyStatus] = useState<'unknown' | 'online' | 'offline'>('unknown');

  // Check proxy server health
  const checkProxyHealth = useCallback(async () => {
    try {
      const response = await fetch(`${API_CONFIG.PROXY_BASE_URL}/health`, {
        method: 'GET'
      });
      
      if (response.ok) {
        setProxyStatus('online');
        return true;
      } else {
        setProxyStatus('offline');
        return false;
      }
    } catch (error) {
      console.error('Proxy health check failed:', error);
      setProxyStatus('offline');
      return false;
    }
  }, []);

  const updateAllPrices = useCallback(async () => {
    if (!isOnline || stocks.length === 0) return;
    
    // Check proxy server first
    const proxyOnline = await checkProxyHealth();
    if (!proxyOnline) {
      setErrors(['Proxy server is offline. Please start the proxy server at http://localhost:3001']);
      return;
    }
    
    // Rate limiting
    const now = new Date();
    if (lastApiCall && (now.getTime() - lastApiCall.getTime()) < API_CONFIG.RATE_LIMIT_DELAY) {
      console.log('Rate limited - skipping update');
      return;
    }
    
    setIsUpdating(true);
    setLastApiCall(now);
    setErrors([]);
    
    const updatedStocks = [];
    const failedStocks = [];
    
    try {
      // Update stock prices one by one
      for (let i = 0; i < stocks.length; i++) {
        const stock = stocks[i];
        
        try {
          const priceData = await stockAPIs[stock.market](stock.symbol);
          updatedStocks.push({
            ...stock,
            currentPrice: priceData.price,
            lastUpdated: priceData.lastUpdated,
            name: priceData.name || stock.name,
            change24h: priceData.change24h,
            changePercent: priceData.changePercent
          });
          
          console.log(`✅ Updated ${stock.symbol}: ${priceData.price.toFixed(2)}`);
          
        } catch (error: any) {
          console.error(`❌ Failed to update ${stock.symbol}:`, error);
          failedStocks.push(`${stock.symbol}: ${error.message}`);
          
          // Keep existing data if update fails
          updatedStocks.push({
            ...stock,
            lastUpdated: stock.lastUpdated // Keep old timestamp to show staleness
          });
        }
        
        // Add delay between API calls
        if (i < stocks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      // Update currency rates
      try {
        const newRates = await getCurrencyRates();
        setExchangeRates(newRates);
      } catch (error: any) {
        console.error('Failed to update currency rates:', error);
        failedStocks.push(`Currency rates: ${error.message}`);
      }
      
      setStocks(updatedStocks);
      setLastUpdate(new Date());
      setErrors(failedStocks);
      
      // Save to localStorage
      localStorage.setItem('portfolioStocks', JSON.stringify(updatedStocks));
      
      // Show summary
      const successCount = updatedStocks.length - failedStocks.filter(f => !f.includes('Currency')).length;
      console.log(`📊 Update complete: ${successCount}/${stocks.length} stocks updated successfully`);
      
    } catch (error: any) {
      console.error('Update failed:', error);
      setErrors([`Update failed: ${error.message}`]);
    } finally {
      setIsUpdating(false);
    }
  }, [stocks, isOnline, setStocks, setExchangeRates, lastApiCall, checkProxyHealth]);

  // Set up auto-refresh
  useEffect(() => {
    if (!isOnline) return;
    
    const interval = setInterval(updateAllPrices, API_CONFIG.UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, [updateAllPrices, isOnline]);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initial proxy health check
  useEffect(() => {
    checkProxyHealth();
  }, [checkProxyHealth]);

  // Initial update
  useEffect(() => {
    if (stocks.length > 0 && isOnline) {
      const timer = setTimeout(updateAllPrices, 3000);
      return () => clearTimeout(timer);
    }
  }, [stocks.length, isOnline, updateAllPrices]);

  return { 
    isUpdating, 
    lastUpdate, 
    isOnline, 
    errors,
    proxyStatus,
    manualUpdate: updateAllPrices 
  };
};

const useStockSearch = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchStocks = useCallback(async (market: 'US' | 'HK' | 'TW', query: string) => {
    if (!query || query.length < 1) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      const results = await searchAPIs[market](query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const addManualTicker = (ticker: string, market: 'US' | 'HK' | 'TW') => {
    return {
      symbol: ticker.toUpperCase(),
      name: `${ticker.toUpperCase()} (Manual Entry)`,
      market: market,
      currency: market === 'US' ? 'USD' : market === 'HK' ? 'HKD' : 'TWD'
    };
  };

  return { searchResults, isSearching, searchStocks, setSearchResults, addManualTicker };
};

// Main App Component
const PortfolioTracker: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [cash, setCash] = useState<Cash[]>([]);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({
    USD: 1, CAD: 1.35, HKD: 7.8, TWD: 31.5, CNY: 7.2
  });
  const [displayCurrencies, setDisplayCurrencies] = useState<string[]>(['USD', 'CAD', 'HKD', 'TWD', 'CNY']);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState<'stock' | 'cash'>('stock');
  const [selectedMarket, setSelectedMarket] = useState<'US' | 'HK' | 'TW'>('US');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState<SearchResult | null>(null);
  const [shares, setShares] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [cashAmount, setCashAmount] = useState('');
  const [newCurrency, setNewCurrency] = useState('');
  const [valuesVisible, setValuesVisible] = useState(true);

  // Custom hooks
  const { isUpdating, lastUpdate, isOnline, errors, proxyStatus, manualUpdate } = useRealTimeUpdates(stocks, setStocks, setExchangeRates);
  const { searchResults, isSearching, searchStocks, setSearchResults, addManualTicker } = useStockSearch();

  // Load data from localStorage
  useEffect(() => {
    const savedStocks = localStorage.getItem('portfolioStocks');
    const savedCash = localStorage.getItem('portfolioCash');
    const savedRates = localStorage.getItem('exchangeRates');
    const savedCurrencies = localStorage.getItem('displayCurrencies');

    if (savedStocks) setStocks(JSON.parse(savedStocks));
    if (savedCash) setCash(JSON.parse(savedCash));
    if (savedRates) setExchangeRates(JSON.parse(savedRates));
    if (savedCurrencies) setDisplayCurrencies(JSON.parse(savedCurrencies));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('portfolioStocks', JSON.stringify(stocks));
  }, [stocks]);

  useEffect(() => {
    localStorage.setItem('portfolioCash', JSON.stringify(cash));
  }, [cash]);

  useEffect(() => {
    localStorage.setItem('displayCurrencies', JSON.stringify(displayCurrencies));
  }, [displayCurrencies]);

  // Search handling
  useEffect(() => {
    if (addType === 'stock' && searchQuery) {
      const timeoutId = setTimeout(() => {
        searchStocks(selectedMarket, searchQuery);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, selectedMarket, addType, searchStocks, setSearchResults]);

  // Helper functions
  const getAllCurrencies = () => {
    const commonCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'HKD', 'TWD', 'CNY', 'SGD', 'KRW'];
    return commonCurrencies.filter(currency => 
      !displayCurrencies.includes(currency) && exchangeRates[currency]
    );
  };

  const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return amount;
    const usdAmount = fromCurrency === 'USD' ? amount : amount / exchangeRates[fromCurrency];
    return toCurrency === 'USD' ? usdAmount : usdAmount * exchangeRates[toCurrency];
  };

  const calculateTotalValue = (currency: string): number => {
    let total = 0;
    
    // Add stock values
    stocks.forEach(stock => {
      const stockValue = stock.shares * stock.currentPrice;
      total += convertCurrency(stockValue, stock.currency, currency);
    });
    
    // Add cash values
    cash.forEach(cashItem => {
      total += convertCurrency(cashItem.amount, cashItem.currency, currency);
    });
    
    return total;
  };

  // Event handlers
  const addStock = () => {
    if (selectedStock && shares) {
      const newStock: Stock = {
        id: Date.now().toString(),
        symbol: selectedStock.symbol,
        shares: parseFloat(shares),
        market: selectedMarket,
        currentPrice: 0, // Will be updated by next refresh
        currency: selectedMarket === 'US' ? 'USD' : selectedMarket === 'HK' ? 'HKD' : 'TWD',
        lastUpdated: new Date().toISOString(),
        name: selectedStock.name
      };
      
      setStocks(prev => [...prev, newStock]);
      resetModal();
    }
  };

  const addCashAmount = () => {
    if (selectedCurrency && cashAmount) {
      const existingCashIndex = cash.findIndex(c => c.currency === selectedCurrency);
      
      if (existingCashIndex >= 0) {
        setCash(prev => prev.map((c, index) => 
          index === existingCashIndex 
            ? { ...c, amount: c.amount + parseFloat(cashAmount) }
            : c
        ));
      } else {
        const newCash: Cash = {
          id: Date.now().toString(),
          currency: selectedCurrency,
          amount: parseFloat(cashAmount)
        };
        setCash(prev => [...prev, newCash]);
      }
      resetModal();
    }
  };

  const resetModal = () => {
    setShowAddModal(false);
    setSearchQuery('');
    setSelectedStock(null);
    setShares('');
    setCashAmount('');
    setSearchResults([]);
  };

  const removeStock = (id: string) => {
    setStocks(prev => prev.filter(stock => stock.id !== id));
  };

  const removeCash = (id: string) => {
    setCash(prev => prev.filter(cashItem => cashItem.id !== id));
  };

  const addNewCurrency = () => {
    if (newCurrency && !displayCurrencies.includes(newCurrency) && exchangeRates[newCurrency]) {
      setDisplayCurrencies(prev => [...prev, newCurrency]);
      setNewCurrency('');
    }
  };

  const removeCurrency = (currency: string) => {
    if (displayCurrencies.length > 1) {
      setDisplayCurrencies(prev => prev.filter(c => c !== currency));
    }
  };

  return (
    <div className="app-container">
      <div className="app-content">
        {/* Header */}
        <div className="header-card">
          <div className="header-top">
            <h1 className="app-title">
              <TrendingUp className="title-icon" />
              Portfolio Tracker
            </h1>
            <div className="header-controls">
              <div className="status-indicator">
                {isOnline ? (
                  <Wifi className="status-icon online" />
                ) : (
                  <WifiOff className="status-icon offline" />
                )}
                {isOnline ? 'Online' : 'Offline'}
              </div>
              <div className="status-indicator">
                <div className={`proxy-dot ${proxyStatus}`}></div>
                Proxy: {proxyStatus}
              </div>
              <button
                onClick={manualUpdate}
                disabled={isUpdating || !isOnline || proxyStatus === 'offline'}
                className="refresh-btn"
              >
                <RefreshCw className={`refresh-icon ${isUpdating ? 'spinning' : ''}`} />
                {isUpdating ? 'Updating...' : 'Refresh'}
              </button>
              <button
                onClick={() => setValuesVisible(!valuesVisible)}
                className="visibility-btn"
              >
                {valuesVisible ? <Eye className="eye-icon" /> : <EyeOff className="eye-icon" />}
              </button>
            </div>
          </div>
          
          {lastUpdate && (
            <div className="update-info">
              <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
              {isUpdating && <span className="updating-text">Updating prices...</span>}
            </div>
          )}
          
          {/* Proxy Status Warning */}
          {proxyStatus === 'offline' && (
            <div className="warning-card">
              <h4 className="warning-title">Proxy Server Offline</h4>
              <p className="warning-text">
                The proxy server at http://localhost:3001 is not running. Please:
              </p>
              <ol className="warning-list">
                <li>Navigate to your proxy server folder</li>
                <li>Run: npm install</li>
                <li>Run: npm start</li>
                <li>Refresh this page</li>
              </ol>
            </div>
          )}
          
          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="error-card">
              <h4 className="error-title">Update Errors:</h4>
              <ul className="error-list">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Total Values */}
        <div className="totals-grid">
          {displayCurrencies.map(currency => (
            <div key={currency} className="total-card">
              <div className="total-header">
                <h3 className="total-currency">{currency}</h3>
                {displayCurrencies.length > 1 && (
                  <button
                    onClick={() => removeCurrency(currency)}
                    className="remove-currency-btn"
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="total-value">
                {valuesVisible ? `${calculateTotalValue(currency).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '****'}
              </p>
            </div>
          ))}
        </div>

        {/* Add Currency */}
        <div className="add-currency-card">
          <h3 className="section-title">Add Currency</h3>
          <div className="add-currency-form">
            <select
              value={newCurrency}
              onChange={(e) => setNewCurrency(e.target.value)}
              className="currency-select"
            >
              <option value="">Select currency...</option>
              {getAllCurrencies().map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
            <button
              onClick={addNewCurrency}
              disabled={!newCurrency}
              className="add-currency-btn"
            >
              Add
            </button>
          </div>
        </div>

        {/* Assets List */}
        <div className="assets-card">
          <div className="assets-header">
            <h2 className="assets-title">Your Assets</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="add-asset-btn"
            >
              <PlusCircle className="add-icon" />
              Add Asset
            </button>
          </div>

          {/* Stocks */}
          {stocks.length > 0 && (
            <div className="stocks-section">
              <h3 className="subsection-title">Stocks</h3>
              <div className="stocks-list">
                {stocks.map(stock => (
                  <div key={stock.id} className="stock-item">
                    <div className="stock-info">
                      <div className="stock-main">
                        <span className="market-badge">
                          {stock.market}
                        </span>
                        <span className="stock-symbol">{stock.symbol}</span>
                        <span className="stock-shares">{stock.shares} shares</span>
                        {stock.changePercent && (
                          <span className={`change-badge ${stock.changePercent >= 0 ? 'positive' : 'negative'}`}>
                            {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                          </span>
                        )}
                      </div>
                      {stock.name && (
                        <p className="stock-name">{stock.name}</p>
                      )}
                    </div>
                    <div className="stock-values">
                      <p className="stock-price">
                        {valuesVisible ? `${stock.currentPrice.toFixed(2)} ${stock.currency}` : '****'}
                      </p>
                      <p className="stock-total">
                        Total: {valuesVisible ? `${(stock.shares * stock.currentPrice).toLocaleString()} ${stock.currency}` : '****'}
                      </p>
                    </div>
                    <button
                      onClick={() => removeStock(stock.id)}
                      className="remove-stock-btn"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cash */}
          {cash.length > 0 && (
            <div className="cash-section">
              <h3 className="subsection-title">Cash</h3>
              <div className="cash-list">
                {cash.map(cashItem => (
                  <div key={cashItem.id} className="cash-item">
                    <div className="cash-info">
                      <DollarSign className="cash-icon" />
                      <span className="cash-currency">{cashItem.currency}</span>
                    </div>
                    <div className="cash-actions">
                      <span className="cash-amount">
                        {valuesVisible ? `${cashItem.amount.toLocaleString()} ${cashItem.currency}` : '****'}
                      </span>
                      <button
                        onClick={() => removeCash(cashItem.id)}
                        className="remove-cash-btn"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stocks.length === 0 && cash.length === 0 && (
            <div className="empty-state">
              <TrendingUp className="empty-icon" />
              <p>No assets added yet. Click "Add Asset" to get started!</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Add New Asset</h3>
            
            {/* Asset Type Selection */}
            <div className="asset-type-selector">
              <div className="type-buttons">
                <button
                  onClick={() => setAddType('stock')}
                  className={`type-btn ${addType === 'stock' ? 'active' : ''}`}
                >
                  Stock
                </button>
                <button
                  onClick={() => setAddType('cash')}
                  className={`type-btn ${addType === 'cash' ? 'active' : ''}`}
                >
                  Cash
                </button>
              </div>
            </div>

            {addType === 'stock' ? (
              <>
                {/* Market Selection */}
                <div className="form-group">
                  <label className="form-label">Market</label>
                  <select
                    value={selectedMarket}
                    onChange={(e) => setSelectedMarket(e.target.value as 'US' | 'HK' | 'TW')}
                    className="form-select"
                  >
                    <option value="US">US Market (Proxy Server)</option>
                    <option value="HK">Hong Kong (Proxy Server)</option>
                    <option value="TW">Taiwan (Proxy Server)</option>
                  </select>
                </div>

                {/* Stock Search */}
                <div className="form-group">
                  <label className="form-label">Search Stock</label>
                  <div className="search-container">
                    <Search className="search-icon" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && searchQuery.trim()) {
                          // Allow manual entry by pressing Enter
                          const manualStock = addManualTicker(searchQuery.trim(), selectedMarket);
                          if (manualStock) {
                            setSelectedStock(manualStock);
                            setSearchQuery(`${manualStock.symbol} - ${manualStock.name}`);
                            setSearchResults([]);
                          }
                        }
                      }}
                      placeholder={`Search ${selectedMarket} stocks or enter ticker directly (press Enter)`}
                      className="search-input"
                    />
                    {isSearching && (
                      <RefreshCw className="search-loading" />
                    )}
                  </div>
                  
                  <p className="search-hint">
                    {selectedMarket === 'US' 
                      ? 'Enter any US ticker (e.g., AAPL, TSLA, AMZN) or search to validate'
                      : selectedMarket === 'HK'
                      ? 'Enter any HK stock code (e.g., 700, 1398, 3690) or search to validate'
                      : 'Enter any TW stock code (e.g., 2330, 2454, 2317) or search to validate'
                    }
                  </p>
                  
                  {/* Search Results */}
                  {searchResults.length > 0 && (
                    <div className="search-results">
                      {searchResults.map((result, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedStock(result);
                            setSearchQuery(`${result.symbol} - ${result.name}`);
                            setSearchResults([]);
                          }}
                          className="search-result"
                        >
                          <div className="result-symbol">{result.symbol}</div>
                          <div className="result-name">{result.name}</div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Manual Entry Hint */}
                  {searchQuery.trim() && searchResults.length === 0 && !isSearching && (
                    <div className="manual-entry-hint">
                      <p>
                        Press <kbd className="kbd">Enter</kbd> to add "{searchQuery.toUpperCase()}" directly
                      </p>
                    </div>
                  )}
                </div>

                {/* Shares Input */}
                <div className="form-group">
                  <label className="form-label">Number of Shares</label>
                  <input
                    type="number"
                    value={shares}
                    onChange={(e) => setShares(e.target.value)}
                    placeholder="Enter shares..."
                    className="form-input"
                  />
                </div>
              </>
            ) : (
              <>
                {/* Currency Selection */}
                <div className="form-group">
                  <label className="form-label">Currency</label>
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="form-select"
                  >
                    {Object.keys(exchangeRates).map(currency => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>

                {/* Amount Input */}
                <div className="form-group">
                  <label className="form-label">Amount</label>
                  <input
                    type="number"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    placeholder="Enter amount..."
                    className="form-input"
                  />
                </div>
              </>
            )}

            {/* Modal Actions */}
            <div className="modal-actions">
              <button
                onClick={resetModal}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button
                onClick={addType === 'stock' ? addStock : addCashAmount}
                disabled={
                  addType === 'stock' 
                    ? (!selectedStock || !shares)
                    : (!selectedCurrency || !cashAmount)
                }
                className="submit-btn"
              >
                Add {addType === 'stock' ? 'Stock' : 'Cash'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioTracker;