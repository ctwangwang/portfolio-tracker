# 📊 Multi-Currency Portfolio Tracker

A privacy-focused web application for tracking equities, cryptocurrencies, precious metals, and cash holdings across multiple markets with real-time currency conversion.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)

## 🌟 Features

### Market Coverage
- 🇺🇸 **US Equities** - NYSE, NASDAQ stocks
- 🇨🇦 **Canadian Equities** - Toronto Stock Exchange (TSX)
- 🇭🇰 **Hong Kong Equities** - Hong Kong Stock Exchange (HKEX)
- 🇹🇼 **Taiwan Equities** - Taiwan Stock Exchange (TWSE)
- 🇨🇳 **China Equities** - Shanghai Stock Exchange (SSE) & Shenzhen Stock Exchange (SZSE)
- ₿ **Cryptocurrencies** - Thousands of cryptocurrencies via CryptoCompare API
- 🥇 **Precious Metals** - Gold, Silver, Platinum, Palladium
- 💵 **Cash Holdings** - 11 currencies

### Multi-Currency Display
View your total portfolio value in **10 currencies**:
- USD (US Dollar)
- CAD (Canadian Dollar)
- HKD (Hong Kong Dollar)
- TWD (Taiwan Dollar)
- CNY (Chinese Yuan)
- JPY (Japanese Yen)
- EUR (Euro)
- GBP (British Pound)
- KRW (South Korean Won)
- AUD (Australian Dollar)

### Key Features
- ✅ **Real-time price updates** from Yahoo Finance & CryptoCompare
- ✅ **Privacy-first design** - All portfolio data stored locally in browser
- ✅ **Auto-merge holdings** - Automatically combines multiple purchases of the same asset
- ✅ **Sortable portfolio table** - Click column headers to sort by any field
- ✅ **Multi-user support** - Each user has isolated portfolio in their browser
- ✅ **Automatic persistence** - Portfolio saved in localStorage
- ✅ **No authentication required** - Quick and easy to use
- ✅ **Responsive design** - Works on desktop and mobile

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn
- API Keys (see Configuration)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/portfolio-tracker.git
cd portfolio-tracker
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```env
EXCHANGE_RATE_API_KEY=your_exchange_rate_key_here
PORT=3000
```

4. **Run the application**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

5. **Open your browser**
```
http://localhost:3000
```

## 🔑 API Keys Setup

### Required APIs

#### 1. ExchangeRate-API
- **Purpose:** Currency conversion
- **Free Tier:** 1,500 requests/month
- **Sign up:** https://www.exchangerate-api.com/
- **Cost:** Free tier available

### Optional: Without API Keys
The app can work with limited functionality using free APIs:
- Yahoo Finance (no key required) - for stock and metal prices
- CryptoCompare (no key required) - for cryptocurrency prices

## 📱 How to Use

### Adding Holdings

#### US Stocks
1. Enter stock symbol (e.g., `AAPL`, `GOOGL`, `MSFT`)
2. Enter quantity
3. Click "Add US Stock"

#### Canadian Stocks
1. Enter TSX symbol (e.g., `SHOP`, `TD`, `RY`)
2. Enter quantity
3. Click "Add CA Stock"

#### Hong Kong Stocks
1. Enter stock code (e.g., `0700` for Tencent, `9988` for Alibaba)
2. Enter quantity
3. Click "Add HK Stock"

#### Taiwan Stocks
1. Enter stock code (e.g., `2330` for TSMC, `2317` for Foxconn)
2. Enter quantity
3. Click "Add TW Stock"

#### Shanghai Stocks (SSE)
1. Enter stock code (e.g., `600519` for Moutai, `601318` for Ping An)
2. Enter quantity
3. Click "Add Shanghai Stock"

**Common codes**: 600xxx, 601xxx, 603xxx, 688xxx

#### Shenzhen Stocks (SZSE)
1. Enter stock code (e.g., `000858` for Wuliangye, `000001` for Ping An Bank)
2. Enter quantity
3. Click "Add Shenzhen Stock"

**Common codes**: 000xxx, 001xxx, 002xxx, 003xxx, 300xxx

#### Cryptocurrencies
**Supports thousands of cryptocurrencies via CryptoCompare API**

Popular examples: BTC, ETH, USDT, BNB, SOL, XRP, ADA, DOGE, DOT, MATIC, AVAX, LINK, UNI, ATOM, LTC, BCH, ALGO, TRX, SHIB

1. Enter crypto symbol (e.g., `BTC`, `ETH`, `SOL`)
2. Enter quantity (supports decimals like 0.5)
3. Click "Add Crypto"

#### Precious Metals
**Supported:** Gold (XAU), Silver (XAG), Platinum (XPT), Palladium (XPD)

1. Select metal type
2. Enter weight in grams
3. Click "Add Metal"

**Note:** 1 troy ounce = 31.1035 grams. Prices are quoted per troy ounce in USD.

#### Cash
1. Select currency
2. Enter amount
3. Click "Add Cash"

### Managing Portfolio
- **Sort Holdings** - Click any column header to sort (Symbol, Quantity, Price, Value, Market)
- **Refresh** - Updates prices and currency conversions
- **Remove** - Click 🗑️ next to any holding
- **Clear All** - Removes entire portfolio
- **Auto-merge** - Adding the same asset multiple times automatically combines quantities

## 🏗️ Project Structure

```
portfolio-tracker/
├── public/
│   ├── index.html          # Main HTML page
│   ├── app.js              # Frontend JavaScript (localStorage logic)
│   └── styles.css          # CSS styling
├── src/
│   ├── controllers/
│   │   └── portfolioController.js  # (Not used in localStorage version)
│   ├── routes/
│   │   └── portfolio.js    # API routes (price lookup & calculations)
│   ├── services/
│   │   ├── stockService.js # Stock, crypto & metal price fetching
│   │   └── currencyService.js  # Currency conversion
│   └── index.js            # Express server
├── test/                   # API testing scripts
├── .env                    # Environment variables (not in repo)
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## 🔒 Privacy & Security

### Data Storage
- **All portfolio data stored in browser localStorage**
- **No server-side storage of user portfolios**
- **No tracking or analytics**
- **No user accounts or authentication**

### What's Logged
- ✅ API endpoint calls (no details)
- ✅ Server startup/errors
- ❌ Stock symbols
- ❌ Quantities
- ❌ Prices
- ❌ Portfolio totals

### Multi-User Privacy
- Each user's portfolio is isolated in their own browser
- No cross-user data sharing
- No session tracking

## 🌐 Deployment

### Deploy to Render

1. **Create account** at [render.com](https://render.com)

2. **Create new Web Service**
   - Connect your GitHub repository
   - Select "Node" environment

3. **Configure build settings**
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Add environment variables**
   - `EXCHANGE_RATE_API_KEY`

5. **Deploy**
   - Render will automatically deploy on git push

### Deploy to Other Platforms

#### Heroku
```bash
heroku create your-app-name
heroku config:set EXCHANGE_RATE_API_KEY=your_key
git push heroku main
```

#### Railway
```bash
railway init
railway up
```

#### Vercel / Netlify
These platforms work best with static sites. For Node.js backend, use Render or Railway.

## 🛠️ Development

### Available Scripts

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start
```

### Adding New Markets

To add support for a new market (e.g., Japan):

1. **Add price fetching method** in `src/services/stockService.js`:
```javascript
async getJPStockPrice(symbol) {
    // Implementation using Yahoo Finance with .T suffix
}
```

2. **Add API route** in `src/routes/portfolio.js`:
```javascript
router.post('/price/jp', async (req, res) => {
    // Call stockService.getJPStockPrice()
});
```

3. **Add UI form** in `public/index.html`

4. **Add form handler** in `public/app.js`

### Testing APIs

The `test/` directory contains scripts to test various APIs:

```bash
# Test US stock API
node test/test-us-api.js

# Test cryptocurrency APIs
node test/test-crypto-api.js

# Test precious metals APIs
node test/test-metals-api.js

# Test other markets
node test/test-ca-api.js  # Canada
node test/test-hk-api.js  # Hong Kong
node test/test-tw-api.js  # Taiwan
```

## 🐛 Troubleshooting

### Common Issues

**Problem:** Stock symbol not found
- **Solution:** Verify symbol is correct for that market (e.g., Canadian stocks need TSX symbols like SHOP, not SHOP.TO)

**Problem:** Crypto price fails
- **Solution:** CryptoCompare supports thousands of cryptocurrencies. Verify the symbol is correct.

**Problem:** Portfolio disappeared
- **Solution:** Portfolio is stored in browser localStorage. Clearing browser data will delete it. Consider exporting your portfolio data regularly.

**Problem:** Currency conversion slow
- **Solution:** Exchange rate API has rate limits. Wait a moment and try again.

**Problem:** Prices not updating
- **Solution:** Click "Refresh" button. Yahoo Finance may have rate limits during market hours.

**Problem:** Metals not showing price
- **Solution:** Yahoo Finance metals futures (GC=F, SI=F, etc.) may have delays. Try refreshing after a minute.

## 📊 Supported Assets

### Stocks by Market

**US (NYSE/NASDAQ)**
- Examples: AAPL, GOOGL, MSFT, AMZN, TSLA, NVDA, META
- Format: Standard ticker symbol

**Canada (TSX)**
- Examples: SHOP, TD, RY, ENB, BMO, CNQ
- Format: Use base symbol (SHOP, not SHOP.TO)

**Hong Kong (HKEX)**
- Examples: 0700 (Tencent), 9988 (Alibaba), 0005 (HSBC)
- Format: 4-digit code (0700, not 700)

**Taiwan (TWSE)**
- Examples: 2330 (TSMC), 2317 (Foxconn), 2454 (MediaTek)
- Format: 4-digit code

### Cryptocurrencies

**Supports thousands of cryptocurrencies via CryptoCompare API**

Popular examples:
- Major: BTC, ETH, USDT, BNB, SOL, XRP, ADA
- DeFi: UNI, LINK, AVAX, MATIC, DOT, ATOM
- Meme: DOGE, SHIB
- Others: LTC, BCH, ALGO, TRX, and many more!

### Precious Metals

**Metals Tracked**
- Gold (XAU) - Symbol: GC=F
- Silver (XAG) - Symbol: SI=F
- Platinum (XPT) - Symbol: PL=F
- Palladium (XPD) - Symbol: PA=F

**Format:** Weight in grams
**Pricing:** USD per troy ounce (1 oz = 31.1035g)
**Data Source:** Yahoo Finance futures prices

### Cash Currencies

USD, CAD, HKD, TWD, CNY, EUR, GBP, JPY, KRW, AUD, SGD

## ✨ New Features

### Auto-Merge Holdings
When you add the same asset multiple times, the app automatically:
- Combines quantities for stocks and cryptocurrencies
- Adds amounts for cash holdings
- Adds weight for precious metals
- Shows a "Merged!" message with the updated total

### Sortable Portfolio Table
Click any column header to sort your portfolio:
- **Symbol** - Alphabetical order (A-Z or Z-A)
- **Quantity** - Numerical order (handles stocks, crypto, metals, and cash)
- **Price** - Sort by current price
- **Value** - Sort by total holding value
- **Market** - Group by market type

Visual indicators:
- ▲ Ascending sort
- ▼ Descending sort
- ⇅ Unsorted (hoverable)
- Highlighted column when sorted

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
1. Keep privacy first - no logging of user data
2. Test with multiple markets
3. Maintain backward compatibility with localStorage format
4. Update README for new features
5. Add tests for new APIs in the `test/` directory

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Yahoo Finance** - Stock and precious metal price data
- **CryptoCompare** - Cryptocurrency prices
- **ExchangeRate-API** - Currency conversion

## 🗺️ Roadmap

- [ ] CSV export/import for backup
- [ ] Price alerts
- [ ] Historical performance charts
- [ ] Dividend tracking
- [ ] More markets (Japan, Korea, Europe, China)
- [ ] Mobile app (React Native)
- [ ] Dark mode
- [ ] PWA support for offline use
- [ ] Portfolio analytics and insights
- [ ] Cost basis tracking

## ⚠️ Disclaimer

This application is for informational purposes only. It does not provide financial, investment, or trading advice. Always consult with a qualified financial advisor before making investment decisions. Price data may be delayed and should not be used for real-time trading decisions.

---

Made with ❤️ for multi-market investors