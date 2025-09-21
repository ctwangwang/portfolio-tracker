import React, { useState, useEffect, useCallback } from 'react';
import { PlusCircle, Search, DollarSign, TrendingUp, Eye, EyeOff, RefreshCw, Wifi, WifiOff } from 'lucide-react';

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
        },
        timeout: 10000
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
        },
        timeout: 10000
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
        },
        timeout: 10000
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
        method: 'GET',
        timeout: 5000
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

// Main App Component (same as before, but with proxy status indicator)
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

  // Event handlers (same as before)
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="text-blue-600" />
              Portfolio Tracker
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {isOnline ? (
                  <Wifi className="w-4 h-4 text-green-500" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-500" />
                )}
                {isOnline ? 'Online' : 'Offline'}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className={`w-3 h-3 rounded-full ${
                  proxyStatus === 'online' ? 'bg-green-500' : 
                  proxyStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
                Proxy: {proxyStatus}
              </div>
              <button
                onClick={manualUpdate}
                disabled={isUpdating || !isOnline || proxyStatus === 'offline'}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
                {isUpdating ? 'Updating...' : 'Refresh'}
              </button>
              <button
                onClick={() => setValuesVisible(!valuesVisible)}
                className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                {valuesVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          {lastUpdate && (
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
              {isUpdating && <span className="text-blue-600">Updating prices...</span>}
            </div>
          )}
          
          {/* Proxy Status Warning */}
          {proxyStatus === 'offline' && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="text-red-800 font-medium mb-2">Proxy Server Offline</h4>
              <p className="text-red-700 text-sm">
                The proxy server at http://localhost:3001 is not running. Please:
              </p>
              <ol className="text-red-700 text-sm mt-2 ml-4 list-decimal">
                <li>Navigate to your proxy server folder</li>
                <li>Run: npm install</li>
                <li>Run: npm start</li>
                <li>Refresh this page</li>
              </ol>
            </div>
          )}
          
          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="text-red-800 font-medium mb-2">Update Errors:</h4>
              <ul className="text-red-700 text-sm space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Rest of the component remains the same as your original code */}
        {/* Total Values, Add Currency, Assets List, and Modal components */}
        
        {/* Total Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {displayCurrencies.map(currency => (
            <div key={currency} className="bg-white rounded-xl shadow-md p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-700">{currency}</h3>
                {displayCurrencies.length > 1 && (
                  <button
                    onClick={() => removeCurrency(currency)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {valuesVisible ? `${calculateTotalValue(currency).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '****'}
              </p>
            </div>
          ))}
        </div>

        {/* Add Currency */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">Add Currency</h3>
          <div className="flex gap-2">
            <select
              value={newCurrency}
              onChange={(e) => setNewCurrency(e.target.value)}
              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select currency...</option>
              {getAllCurrencies().map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
            <button
              onClick={addNewCurrency}
              disabled={!newCurrency}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>

        {/* Assets List */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Your Assets</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PlusCircle className="w-5 h-5" />
              Add Asset
            </button>
          </div>

          {/* Stocks */}
          {stocks.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Stocks</h3>
              <div className="space-y-2">
                {stocks.map(stock => (
                  <div key={stock.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {stock.market}
                        </span>
                        <span className="font-medium">{stock.symbol}</span>
                        <span className="text-gray-600">{stock.shares} shares</span>
                        {stock.changePercent && (
                          <span className={`text-xs px-1 py-0.5 rounded ${
                            stock.changePercent >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                          </span>
                        )}
                      </div>
                      {stock.name && (
                        <p className="text-sm text-gray-500 mt-1">{stock.name}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {valuesVisible ? `${stock.currentPrice.toFixed(2)} ${stock.currency}` : '****'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Total: {valuesVisible ? `${(stock.shares * stock.currentPrice).toLocaleString()} ${stock.currency}` : '****'}
                      </p>
                    </div>
                    <button
                      onClick={() => removeStock(stock.id)}
                      className="ml-4 text-red-500 hover:text-red-700"
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
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Cash</h3>
              <div className="space-y-2">
                {cash.map(cashItem => (
                  <div key={cashItem.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="font-medium">{cashItem.currency}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold">
                        {valuesVisible ? `${cashItem.amount.toLocaleString()} ${cashItem.currency}` : '****'}
                      </span>
                      <button
                        onClick={() => removeCash(cashItem.id)}
                        className="text-red-500 hover:text-red-700"
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
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No assets added yet. Click "Add Asset" to get started!</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Asset Modal - Same as your original modal code */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Add New Asset</h3>
            
            {/* Asset Type Selection */}
            <div className="mb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setAddType('stock')}
                  className={`flex-1 p-2 rounded-lg ${addType === 'stock' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                  Stock
                </button>
                <button
                  onClick={() => setAddType('cash')}
                  className={`flex-1 p-2 rounded-lg ${addType === 'cash' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                  Cash
                </button>
              </div>
            </div>

            {addType === 'stock' ? (
              <>
                {/* Market Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Market</label>
                  <select
                    value={selectedMarket}
                    onChange={(e) => setSelectedMarket(e.target.value as 'US' | 'HK' | 'TW')}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="US">US Market (Proxy Server)</option>
                    <option value="HK">Hong Kong (Proxy Server)</option>
                    <option value="TW">Taiwan (Proxy Server)</option>
                  </select>
                </div>

                {/* Stock Search */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Search Stock</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
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
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {isSearching && (
                      <RefreshCw className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedMarket === 'US' 
                      ? 'Enter any US ticker (e.g., AAPL, TSLA, AMZN) or search to validate'
                      : selectedMarket === 'HK'
                      ? 'Enter any HK stock code (e.g., 700, 1398, 3690) or search to validate'
                      : 'Enter any TW stock code (e.g., 2330, 2454, 2317) or search to validate'
                    }
                  </p>
                  
                  {/* Search Results */}
                  {searchResults.length > 0 && (
                    <div className="mt-2 border rounded-lg max-h-40 overflow-y-auto">
                      {searchResults.map((result, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedStock(result);
                            setSearchQuery(`${result.symbol} - ${result.name}`);
                            setSearchResults([]);
                          }}
                          className="w-full p-2 text-left hover:bg-gray-50 border-b last:border-b-0"
                        >
                          <div className="font-medium">{result.symbol}</div>
                          <div className="text-sm text-gray-600">{result.name}</div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Manual Entry Hint */}
                  {searchQuery.trim() && searchResults.length === 0 && !isSearching && (
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700">
                        Press <kbd className="px-1 py-0.5 bg-blue-200 rounded text-xs">Enter</kbd> to add "{searchQuery.toUpperCase()}" directly
                      </p>
                    </div>
                  )}
                </div>

                {/* Shares Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Number of Shares</label>
                  <input
                    type="number"
                    value={shares}
                    onChange={(e) => setShares(e.target.value)}
                    placeholder="Enter shares..."
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            ) : (
              <>
                {/* Currency Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Currency</label>
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.keys(exchangeRates).map(currency => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>

                {/* Amount Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Amount</label>
                  <input
                    type="number"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    placeholder="Enter amount..."
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            {/* Modal Actions */}
            <div className="flex gap-3">
              <button
                onClick={resetModal}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
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
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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