# 📊 Multi-Currency Portfolio Tracker

A privacy-focused web application for tracking equities, cryptocurrencies, and cash holdings across multiple markets with real-time currency conversion.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)

## 🌟 Features

### Market Coverage
- 🇺🇸 **US Equities** - NYSE, NASDAQ stocks
- 🇨🇦 **Canadian Equities** - Toronto Stock Exchange (TSX)
- 🇭🇰 **Hong Kong Equities** - Hong Kong Stock Exchange (HKEX)
- 🇹🇼 **Taiwan Equities** - Taiwan Stock Exchange (TWSE)
- ₿ **Cryptocurrencies** - 19 major cryptocurrencies
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
- ✅ **Real-time price updates** from Yahoo Finance & Binance
- ✅ **Privacy-first design** - All portfolio data stored locally in browser
- ✅ **Multi-user support** - Each user has isolated portfolio
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
FINNHUB_API_KEY=your_finnhub_key_here
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

#### 1. Finnhub API (Optional - backup for some markets)
- **Purpose:** Stock price data
- **Free Tier:** 60 calls/minute
- **Sign up:** https://finnhub.io/register
- **Cost:** Free tier available

#### 2. ExchangeRate-API
- **Purpose:** Currency conversion
- **Free Tier:** 1,500 requests/month
- **Sign up:** https://www.exchangerate-api.com/
- **Cost:** Free tier available

### Optional: Without API Keys
The app can work with limited functionality using free APIs:
- Yahoo Finance (no key required) - for stock prices
- Binance Public API (no key required) - for crypto prices

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

#### Cryptocurrencies
**Supported:** BTC, ETH, USDT, BNB, SOL, ADA, XRP, DOT, DOGE, MATIC, AVAX, LINK, UNI, ATOM, LTC, BCH, ALGO, TRX, SHIB

1. Enter crypto symbol (e.g., `BTC`, `ETH`)
2. Enter quantity (supports decimals)
3. Click "Add Crypto"

#### Cash
1. Select currency
2. Enter amount
3. Click "Add Cash"

### Managing Portfolio
- **Refresh** - Updates prices and currency conversions
- **Remove** - Click 🗑️ next to any holding
- **Clear All** - Removes entire portfolio

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
│   │   ├── stockService.js # Stock & crypto price fetching
│   │   └── currencyService.js  # Currency conversion
│   └── index.js            # Express server
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
   - `FINNHUB_API_KEY`
   - `EXCHANGE_RATE_API_KEY`

5. **Deploy**
   - Render will automatically deploy on git push

### Deploy to Other Platforms

#### Heroku
```bash
heroku create your-app-name
heroku config:set FINNHUB_API_KEY=your_key
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

### Adding New Cryptocurrencies

Edit `src/services/stockService.js`:
```javascript
this.cryptoIdMap = {
    'BTC': 'bitcoin',
    'YOUR_SYMBOL': 'coingecko-id',
    // ...
};
```

## 🐛 Troubleshooting

### Common Issues

**Problem:** Stock symbol not found
- **Solution:** Verify symbol is correct for that market (e.g., Canadian stocks need TSX symbols)

**Problem:** Crypto price fails
- **Solution:** Check if crypto is in supported list. App tries multiple APIs automatically.

**Problem:** Portfolio disappeared
- **Solution:** Portfolio is stored in browser localStorage. Clearing browser data will delete it.

**Problem:** Currency conversion slow
- **Solution:** Exchange rate API has rate limits. Wait a moment and try again.

**Problem:** Prices not updating
- **Solution:** Click "Refresh" button. Yahoo Finance may have rate limits during market hours.

## 📊 Supported Assets

### Stocks by Market

**US (NYSE/NASDAQ)**
- Examples: AAPL, GOOGL, MSFT, AMZN, TSLA, NVDA, META

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
BTC, ETH, USDT, BNB, SOL, ADA, XRP, DOT, DOGE, MATIC, AVAX, LINK, UNI, ATOM, LTC, BCH, ALGO, TRX, SHIB

### Cash Currencies
USD, CAD, HKD, TWD, CNY, EUR, GBP, JPY, KRW, AUD, SGD

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
1. Keep privacy first - no logging of user data
2. Test with multiple markets
3. Maintain backward compatibility with localStorage format
4. Update README for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Yahoo Finance** - Stock price data
- **Binance** - Cryptocurrency prices
- **CryptoCompare** - Backup crypto prices
- **ExchangeRate-API** - Currency conversion

## 🗺️ Roadmap

- [ ] CSV export/import for backup
- [ ] Price alerts
- [ ] Historical performance charts
- [ ] Dividend tracking
- [ ] More markets (Japan, Korea, Europe)
- [ ] Mobile app (React Native)
- [ ] Dark mode
- [ ] PWA support for offline use

## ⚠️ Disclaimer

This application is for informational purposes only. It does not provide financial, investment, or trading advice. Always consult with a qualified financial advisor before making investment decisions. Price data may be delayed and should not be used for real-time trading decisions.

---

Made with ❤️ for multi-market investors
