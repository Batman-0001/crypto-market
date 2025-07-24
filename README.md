# 🚀 Interactive Crypto Calendar

An interactive calendar component for cryptocurrency market data visualization with real-time data integration, volatility heatmaps, liquidity indicators, and performance metrics.

## ✨ Features

### 📅 Interactive Calendar Component

- **Multi-view Support**: Daily, Weekly, and Monthly calendar views
- **Smooth Transitions**: Seamless navigation between different time periods
- **Date Navigation**: Navigate between months/years with intuitive controls
- **Today Indicator**: Visual highlight for the current date
- **Keyboard Navigation**: Full keyboard support (arrow keys, enter, escape)

### 📊 Data Visualization Layers

#### 🔥 Volatility Heatmap

- **Color-coded cells** based on market volatility levels:
  - 🟢 **Low volatility** (< 2%): Green shades
  - 🟡 **Medium volatility** (2-5%): Yellow/Orange shades
  - 🔴 **High volatility** (> 5%): Red shades

#### 💧 Liquidity Indicators

- **Trading volume visualization** with:
  - 🔵 **Dot patterns**: Background patterns showing volume density
  - 📊 **Volume bars**: Bottom indicators showing relative volume
  - 🎯 **Pattern intensity**: Varies based on trading activity

#### 📈 Performance Metrics

- **Price change visualization**:
  - ↗️ **Positive performance**: Upward arrows and green indicators
  - ↘️ **Negative performance**: Downward arrows and red indicators
  - → **Neutral**: Gray indicators for minimal change
  - 🏺 **Border colors**: Left border color-coding for quick identification

### 📊 Advanced Data Dashboard

#### 🎯 Comprehensive Analytics Panel

- **Professional-grade analysis interface** accessible via:
  - 🖱️ **Double-click** any calendar cell
  - ⌨️ **Keyboard shortcut** (`D` key)
  - 🎛️ **Dashboard button** in controls panel

#### 📈 Four Analysis Tabs

1. **📋 Overview Tab**:

   - OHLC (Open, High, Low, Close) price summary
   - Volume & liquidity metrics with percentile rankings
   - Volatility analysis with risk classifications
   - Price change indicators with trend direction

2. **⚡ Technical Analysis Tab**:

   - Interactive price charts with moving averages (SMA 20/50)
   - Technical indicators (RSI, MACD, Bollinger Bands)
   - Signal interpretation (Bullish/Bearish/Neutral)
   - Volume profile analysis with pattern recognition

3. **🎯 Performance Tab**:

   - 30-day performance summary with key metrics
   - Sharpe ratio and risk-adjusted returns
   - Maximum drawdown analysis
   - Cumulative returns visualization

4. **⚠️ Risk Metrics Tab**:
   - Value at Risk (VaR) at 95% and 99% confidence levels
   - Downside deviation for negative return analysis
   - Beta coefficient for market correlation
   - Calmar ratio for risk-adjusted performance

### ⏱️ Multi-Timeframe Support

#### 📅 Daily View

- Detailed metrics for each day
- Intraday volatility ranges
- Daily trading volume and liquidity
- Daily price change percentages

#### 📊 Weekly View

- Aggregated daily data into weekly summaries
- Weekly average volatility
- Total weekly volume
- Weekly performance overview

#### 📈 Monthly View

- Monthly overview with key metrics
- Monthly volatility trends
- Monthly liquidity patterns
- Monthly performance highlights

### 🔌 Real-time Data Integration

- **Binance API Integration**: Free cryptocurrency market data
- **Automatic Updates**: Real-time ticker updates every 10 seconds
- **Multiple Cryptocurrencies**: Support for BTC, ETH, ADA, DOT, and more
- **Error Handling**: Graceful fallback for API failures

### ♿ Accessibility Features

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: ARIA labels and descriptions
- **High Contrast**: Support for high contrast mode
- **Reduced Motion**: Respects user motion preferences
- **Focus Management**: Clear focus indicators

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Setup environment variables**:

   ```bash
   # Copy the example environment file
   cp .env.example .env

   # Edit .env file with your configuration
   # Most settings have sensible defaults and work out of the box
   ```

3. **Configure API settings** (optional):

   ```bash
   # Open .env file and customize:
   VITE_CRYPTO_API_BASE_URL=https://api.binance.com/api/v3
   VITE_DEFAULT_CRYPTO_SYMBOL=BTCUSDT
   VITE_REFRESH_INTERVAL_TICKER=10000

   # For premium features (optional):
   # VITE_BINANCE_API_KEY=your_api_key_here
   # VITE_BINANCE_SECRET_KEY=your_secret_key_here
   ```

4. **Start the development server**:

   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to the provided local URL (usually `http://localhost:5173`)

### 🔐 Environment Variables

The application uses environment variables for configuration and security:

#### **Required Variables** (have defaults):

- `VITE_CRYPTO_API_BASE_URL` - Binance API endpoint
- `VITE_CRYPTO_API_TIMEOUT` - API request timeout
- `VITE_DEFAULT_CRYPTO_SYMBOL` - Default cryptocurrency

#### **Optional Variables**:

- `VITE_BINANCE_API_KEY` - For authenticated endpoints
- `VITE_BINANCE_SECRET_KEY` - For authenticated endpoints
- `VITE_REFRESH_INTERVAL_TICKER` - How often to refresh data
- `VITE_ENABLE_DEBUG_LOGGING` - Enable detailed logging

#### **Feature Toggles**:

- `VITE_ENABLE_ORDERBOOK_DATA` - Enable/disable orderbook features
- `VITE_ENABLE_WEBSOCKET_UPDATES` - Real-time WebSocket updates

#### **Security Note**:

- The `.env` file is excluded from git for security
- Use `.env.example` as a template
- Never commit API keys or secrets to version control

## 🎮 Usage Guide

### 📅 Basic Calendar Interaction

- **Navigate months**: Use arrow buttons in the header or `←/→` arrow keys
- **Select dates**: Click on any calendar cell to select it
- **Hover for details**: Move mouse over cells to see tooltip information
- **Zoom**: Use `Ctrl + Plus/Minus` or zoom controls to scale the calendar

### 📊 DataDashboard Access

#### **Opening the Dashboard**:

1. **Double-click method**: Double-click any calendar cell with data
2. **Keyboard shortcut**: Select a date and press `D` key
3. **Control panel**: Select a date and click "Dashboard" button

#### **Dashboard Navigation**:

- **Overview Tab**: View price summary, volume metrics, and volatility analysis
- **Technical Tab**: Analyze price charts, moving averages, RSI, and MACD
- **Performance Tab**: Review 30-day performance, Sharpe ratio, and returns
- **Risk Metrics Tab**: Examine VaR, downside deviation, and risk indicators

#### **Dashboard Features**:

- **Interactive Charts**: Hover over data points for detailed information
- **Technical Signals**: Color-coded bullish/bearish indicators
- **Risk Assessment**: Visual risk levels with explanatory tooltips
- **Performance Metrics**: Comprehensive financial analysis tools

### 🎛️ Advanced Controls

#### **Filtering Options**:

- **Volatility Range**: Adjust slider to filter by volatility percentage (0-20%)
- **Volume Range**: Filter by volume percentile ranking (0-100%)
- **Feature Toggles**: Enable/disable heatmaps, liquidity indicators, and performance metrics

#### **Keyboard Shortcuts**:

- `Escape` - Close panels and deselect
- `D` - Open DataDashboard for selected date
- `F` - Open detail panel for selected date
- `Ctrl + R` - Refresh market data
- `Ctrl + H` - Toggle controls panel
- `Ctrl + Z` - Reset zoom level
- `Arrow Keys` - Navigate calendar dates

#### **Date Range Selection**:

- **Right-click** to start range selection
- **Drag** to extend selection
- **Click "Clear"** to reset range selection

### 🔍 Data Interpretation

#### **Color Coding**:

- **Green**: Positive performance, low risk, bullish signals
- **Red**: Negative performance, high risk, bearish signals
- **Yellow/Orange**: Moderate levels, warning conditions
- **Blue**: Informational, neutral conditions

#### **Volatility Levels**:

- **Low (Green)**: < 2% daily volatility - Stable price action
- **Moderate (Yellow)**: 2-5% volatility - Normal market movement
- **High (Orange)**: 5-10% volatility - Increased price swings
- **Extreme (Red)**: > 10% volatility - Highly volatile conditions

#### **Technical Signal Interpretation**:

- **RSI > 70**: Potentially overbought condition
- **RSI < 30**: Potentially oversold condition
- **Price above SMA**: Bullish trend indication
- **MACD positive**: Upward momentum signal

## 🛠️ Technology Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI)
- **Charts**: Recharts
- **Date Utilities**: date-fns
- **API Client**: Axios
- **Styling**: CSS-in-JS with MUI's styling solution

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── CalendarCell.jsx         # Individual calendar cell
│   ├── CalendarHeader.jsx       # Navigation header
│   ├── CalendarLegend.jsx       # Data visualization legend
│   └── InteractiveCalendar.jsx  # Main calendar component
├── hooks/               # Custom React hooks
│   ├── useCryptoData.js        # Cryptocurrency data management
│   └── useKeyboardNavigation.js # Keyboard navigation logic
├── services/            # API and data services
│   └── cryptoDataService.js    # Binance API integration
├── utils/               # Utility functions
│   ├── colorUtils.js           # Color calculations for visualization
│   └── dateUtils.js            # Date manipulation utilities
├── constants/           # Application constants
│   └── index.js                # App configuration and constants
├── App.jsx             # Main application component
└── main.jsx            # Application entry point
```

## ⌨️ Keyboard Navigation

- **Arrow Keys**: Navigate between dates
- **Ctrl + Arrow Keys**: Navigate by weeks/months
- **Enter/Space**: Select focused date
- **Escape**: Cancel selection
- **Home**: Go to first day of month
- **End**: Go to last day of month
- **Page Up/Down**: Navigate months
- **Shift + Page Up/Down**: Navigate years

## 📱 Responsive Design

The calendar is fully responsive and optimized for:

- **Desktop**: Full feature set with large calendar cells
- **Tablet**: Optimized touch interactions
- **Mobile**: Compact view with essential features

## 🤝 Contributing

The codebase is structured to be modular and human-readable:

- **Clear component separation**
- **Comprehensive comments**
- **Consistent naming conventions**
- **Reusable utility functions**
- **Custom hooks for logic separation**
