import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, DollarSign, TrendingUp, Eye, EyeOff } from 'lucide-react';
import './App.css';

// Types
interface Stock {
  id: string;
  symbol: string;
  shares: number;
  market: 'US' | 'HK' | 'TW';
  currentPrice: number;
  currency: string;
  lastUpdated: string;
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
}

interface MockPrices {
  [key: string]: {
    price: number;
    currency: string;
  };
}

interface CurrencySymbols {
  [key: string]: string;
}

// Mock API functions (replace with real APIs later)
const mockStockSearch = async (market: string, query: string): Promise<SearchResult[]> => {
  const mockData: { [key: string]: SearchResult[] } = {
    US: [
      { symbol: 'TSLA', name: 'Tesla Inc' },
      { symbol: 'AAPL', name: 'Apple Inc' },
      { symbol: 'GOOGL', name: 'Alphabet Inc' },
      { symbol: 'MSFT', name: 'Microsoft Corp' },
      { symbol: 'AMZN', name: 'Amazon.com Inc' }
    ],
    HK: [
      { symbol: '00700', name: 'Tencent Holdings' },
      { symbol: '00939', name: 'China Construction Bank' },
      { symbol: '00941', name: 'China Mobile' },
      { symbol: '00005', name: 'HSBC Holdings' }
    ],
    TW: [
      { symbol: '2330', name: 'Taiwan Semiconductor' },
      { symbol: '2454', name: 'MediaTek Inc' },
      { symbol: '2317', name: 'Hon Hai Precision' },
      { symbol: '2412', name: 'Chunghwa Telecom' }
    ]
  };
  
  return mockData[market]?.filter(stock => 
    stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
    stock.name.toLowerCase().includes(query.toLowerCase())
  ) || [];
};

const mockGetStockPrice = async (symbol: string, market: string): Promise<{ price: number; currency: string }> => {
  // Mock prices - replace with real API
  const mockPrices: MockPrices = {
    'TSLA': { price: 248.50, currency: 'USD' },
    'AAPL': { price: 189.25, currency: 'USD' },
    '00700': { price: 312.40, currency: 'HKD' },
    '2330': { price: 545.00, currency: 'TWD' }
  };
  
  return mockPrices[symbol] || { 
    price: Math.random() * 200, 
    currency: market === 'US' ? 'USD' : market === 'HK' ? 'HKD' : 'TWD' 
  };
};

const mockGetExchangeRates = async (): Promise<ExchangeRates> => {
  // Mock exchange rates (base: USD)
  return {
    USD: 1.00,
    CAD: 1.36,
    HKD: 7.80,
    TWD: 31.50,
    CNY: 7.25
  };
};

const CURRENCY_SYMBOLS: CurrencySymbols = {
  USD: '$',
  CAD: 'C$',
  HKD: 'HK$',
  TWD: 'NT$',
  CNY: '¥'
};

const AVAILABLE_CURRENCIES = ['USD', 'CAD', 'HKD', 'TWD', 'CNY', 'EUR', 'GBP', 'JPY', 'AUD', 'SGD'];

function App() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [cash, setCash] = useState<Cash[]>([]);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [displayCurrencies, setDisplayCurrencies] = useState(['USD', 'CAD', 'HKD', 'TWD', 'CNY']);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState<'stock' | 'cash'>('stock');
  const [selectedMarket, setSelectedMarket] = useState<'US' | 'HK' | 'TW'>('US');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedStock, setSelectedStock] = useState<SearchResult | null>(null);
  const [shares, setShares] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [cashAmount, setCashAmount] = useState('');
  const [showValues, setShowValues] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedStocks = localStorage.getItem('portfolioStocks');
    const savedCash = localStorage.getItem('portfolioCash');
    const savedCurrencies = localStorage.getItem('displayCurrencies');
    
    if (savedStocks) setStocks(JSON.parse(savedStocks));
    if (savedCash) setCash(JSON.parse(savedCash));
    if (savedCurrencies) setDisplayCurrencies(JSON.parse(savedCurrencies));
    
    // Load exchange rates
    loadExchangeRates();
    
    // Set up periodic updates (every minute)
    const interval = setInterval(() => {
      updateStockPrices();
      loadExchangeRates();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('portfolioStocks', JSON.stringify(stocks));
  }, [stocks]);

  useEffect(() => {
    localStorage.setItem('portfolioCash', JSON.stringify(cash));
  }, [cash]);

  useEffect(() => {
    localStorage.setItem('displayCurrencies', JSON.stringify(displayCurrencies));
  }, [displayCurrencies]);

  const loadExchangeRates = async () => {
    try {
      const rates = await mockGetExchangeRates();
      setExchangeRates(rates);
    } catch (error) {
      console.error('Failed to load exchange rates:', error);
    }
  };

  const updateStockPrices = async () => {
    if (stocks.length === 0) return;
    
    const updatedStocks = await Promise.all(
      stocks.map(async (stock) => {
        try {
          const priceData = await mockGetStockPrice(stock.symbol, stock.market);
          return {
            ...stock,
            currentPrice: priceData.price,
            lastUpdated: new Date().toISOString()
          };
        } catch (error) {
          console.error(`Failed to update price for ${stock.symbol}:`, error);
          return stock;
        }
      })
    );
    
    setStocks(updatedStocks);
  };

  const handleSearch = async (query: string) => {
    if (query.length < 1) {
      setSearchResults([]);
      return;
    }
    
    try {
      const results = await mockStockSearch(selectedMarket, query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    }
  };

  const addStock = async () => {
    if (!selectedStock || !shares) return;
    
    try {
      const priceData = await mockGetStockPrice(selectedStock.symbol, selectedMarket);
      const newStock: Stock = {
        id: Date.now().toString(),
        symbol: selectedStock.symbol,
        shares: parseFloat(shares),
        market: selectedMarket,
        currentPrice: priceData.price,
        currency: priceData.currency,
        lastUpdated: new Date().toISOString()
      };
      
      setStocks([...stocks, newStock]);
      resetModal();
    } catch (error) {
      console.error('Failed to add stock:', error);
    }
  };

  const addCash = () => {
    if (!cashAmount || !selectedCurrency) return;
    
    const existingCashIndex = cash.findIndex(c => c.currency === selectedCurrency);
    
    if (existingCashIndex >= 0) {
      // Update existing cash
      const updatedCash = [...cash];
      updatedCash[existingCashIndex].amount += parseFloat(cashAmount);
      setCash(updatedCash);
    } else {
      // Add new cash
      const newCash: Cash = {
        id: Date.now().toString(),
        currency: selectedCurrency,
        amount: parseFloat(cashAmount)
      };
      setCash([...cash, newCash]);
    }
    
    resetModal();
  };

  const resetModal = () => {
    setShowAddModal(false);
    setSearchQuery('');
    setSearchResults([]);
    setSelectedStock(null);
    setShares('');
    setCashAmount('');
    setSelectedCurrency('USD');
  };

  const removeStock = (id: string) => {
    setStocks(stocks.filter(stock => stock.id !== id));
  };

  const removeCash = (id: string) => {
    setCash(cash.filter(c => c.id !== id));
  };

  const addDisplayCurrency = (currency: string) => {
    if (!displayCurrencies.includes(currency)) {
      setDisplayCurrencies([...displayCurrencies, currency]);
    }
  };

  const convertValue = (amount: number, fromCurrency: string, toCurrency: string) => {
    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) return 0;
    const usdAmount = amount / exchangeRates[fromCurrency];
    return usdAmount * exchangeRates[toCurrency];
  };

  const calculateTotalInCurrency = (targetCurrency: string) => {
    let total = 0;
    
    // Add stock values
    stocks.forEach(stock => {
      const stockValue = stock.shares * stock.currentPrice;
      total += convertValue(stockValue, stock.currency, targetCurrency);
    });
    
    // Add cash values
    cash.forEach(c => {
      total += convertValue(c.amount, c.currency, targetCurrency);
    });
    
    return total;
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbol = CURRENCY_SYMBOLS[currency] || currency;
    return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Portfolio Tracker</h1>
            <button
              onClick={() => setShowValues(!showValues)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border rounded-md hover:bg-gray-50"
            >
              {showValues ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {showValues ? 'Hide Values' : 'Show Values'}
            </button>
          </div>
          
          {/* Total Values */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {displayCurrencies.map(currency => (
              <div key={currency} className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-600 mb-1">{currency}</div>
                <div className="text-lg font-bold text-gray-900">
                  {showValues ? formatCurrency(calculateTotalInCurrency(currency), currency) : '••••••'}
                </div>
              </div>
            ))}
          </div>
          
          {/* Currency Management */}
          <div className="mt-4 flex flex-wrap gap-2">
            {AVAILABLE_CURRENCIES.filter(c => !displayCurrencies.includes(c)).map(currency => (
              <button
                key={currency}
                onClick={() => addDisplayCurrency(currency)}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200"
              >
                + {currency}
              </button>
            ))}
          </div>
        </div>

        {/* Add Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PlusCircle className="w-5 h-5" />
            Add Asset
          </button>
        </div>

        {/* Holdings */}
        <div className="space-y-4">
          {/* Stocks */}
          {stocks.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Stocks
              </h2>
              <div className="space-y-3">
                {stocks.map(stock => (
                  <div key={stock.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{stock.symbol}</div>
                      <div className="text-sm text-gray-600">{stock.shares} shares • {stock.market}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {showValues ? formatCurrency(stock.shares * stock.currentPrice, stock.currency) : '••••••'}
                      </div>
                      <button
                        onClick={() => removeStock(stock.id)}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cash */}
          {cash.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Cash
              </h2>
              <div className="space-y-3">
                {cash.map(c => (
                  <div key={c.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{c.currency}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {showValues ? formatCurrency(c.amount, c.currency) : '••••••'}
                      </div>
                      <button
                        onClick={() => removeCash(c.id)}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Add Asset</h3>
              
              {/* Type Selection */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setAddType('stock')}
                  className={`px-4 py-2 rounded-lg flex-1 ${addType === 'stock' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  Stock
                </button>
                <button
                  onClick={() => setAddType('cash')}
                  className={`px-4 py-2 rounded-lg flex-1 ${addType === 'cash' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  Cash
                </button>
              </div>

              {addType === 'stock' ? (
                <>
                  {/* Market Selection */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Market</label>
                    <select
                      value={selectedMarket}
                      onChange={(e) => setSelectedMarket(e.target.value as 'US' | 'HK' | 'TW')}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="US">United States</option>
                      <option value="HK">Hong Kong</option>
                      <option value="TW">Taiwan</option>
                    </select>
                  </div>

                  {/* Stock Search */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search Stock</label>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          handleSearch(e.target.value);
                        }}
                        placeholder="Enter ticker symbol or company name"
                        className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    {/* Search Results */}
                    {searchResults.length > 0 && (
                      <div className="mt-2 border rounded-lg max-h-40 overflow-y-auto">
                        {searchResults.map((result, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSelectedStock(result);
                              setSearchQuery(result.symbol);
                              setSearchResults([]);
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-gray-50 border-b last:border-b-0"
                          >
                            <div className="font-medium">{result.symbol}</div>
                            <div className="text-sm text-gray-600">{result.name}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Shares */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shares</label>
                    <input
                      type="number"
                      value={shares}
                      onChange={(e) => setShares(e.target.value)}
                      placeholder="Enter number of shares"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Currency Selection */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select
                      value={selectedCurrency}
                      onChange={(e) => setSelectedCurrency(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {AVAILABLE_CURRENCIES.map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                      ))}
                    </select>
                  </div>

                  {/* Amount */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                    <input
                      type="number"
                      value={cashAmount}
                      onChange={(e) => setCashAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={resetModal}
                  className="flex-1 px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addType === 'stock' ? addStock : addCash}
                  disabled={addType === 'stock' ? !selectedStock || !shares : !cashAmount}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;