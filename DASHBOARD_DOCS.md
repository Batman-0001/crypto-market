# Data Dashboard Panel Documentation

## Overview

The **Data Dashboard Panel** is a comprehensive analytics interface that provides detailed financial metrics, technical analysis, and risk assessment for selected cryptocurrency market data. It appears as a side panel when a date is double-clicked or accessed via keyboard shortcuts.

## Features

### 📊 Four Main Analysis Tabs

#### 1. **Overview Tab**

- **Price Summary**: OHLC (Open, High, Low, Close) prices
- **Volume & Liquidity**: Trading volume with percentile ranking and liquidity scores
- **Volatility Metrics**: Daily volatility with color-coded risk ratings
- **Price Change Indicators**: Trend direction with percentage changes

#### 2. **Technical Analysis Tab**

- **Price Charts**: Interactive charts with moving averages (SMA 20, SMA 50)
- **Technical Indicators Table**:
  - RSI (Relative Strength Index) - 14 period
  - Simple Moving Averages (20 & 50 day)
  - MACD (Moving Average Convergence Divergence)
  - Signal interpretation (Bullish/Bearish/Neutral)
- **Volume Analysis**: Volume profile charts and patterns

#### 3. **Performance Tab**

- **30-Day Performance Summary**:
  - Total Return percentage
  - Sharpe Ratio calculation
  - Maximum Drawdown analysis
  - Average Daily Return
- **Cumulative Returns Chart**: Visual performance tracking
- **Benchmark Comparisons**: Performance vs market indices (when available)

#### 4. **Risk Metrics Tab**

- **Value at Risk (VaR)**: 95% and 99% confidence levels
- **Downside Deviation**: Volatility of negative returns
- **Beta Analysis**: Correlation with market movements
- **Calmar Ratio**: Return vs maximum drawdown ratio
- **Risk Assessment**: Color-coded risk indicators

## Access Methods

### 🖱️ Mouse Interactions

- **Double-click** any calendar cell with data to open the dashboard
- Click the **"Dashboard"** button in the calendar controls (when a date is selected)

### ⌨️ Keyboard Shortcuts

- **`D`** - Open dashboard for currently selected date
- **`Escape`** - Close dashboard panel

## Technical Indicators Explained

### 📈 Calculated Metrics

#### **RSI (Relative Strength Index)**

- **Range**: 0-100
- **Overbought**: > 70 (Sell signal)
- **Oversold**: < 30 (Buy signal)
- **Neutral**: 30-70

#### **Moving Averages**

- **SMA 20**: 20-day Simple Moving Average
- **SMA 50**: 50-day Simple Moving Average
- **Bullish Signal**: Price above moving average
- **Bearish Signal**: Price below moving average

#### **MACD (Moving Average Convergence Divergence)**

- **Positive MACD**: Bullish momentum
- **Negative MACD**: Bearish momentum
- **Signal Line Crossovers**: Buy/Sell indicators

#### **Bollinger Bands**

- **Upper Band**: SMA + (2 × Standard Deviation)
- **Lower Band**: SMA - (2 × Standard Deviation)
- **Price Action**: Indicates volatility and potential reversal points

### 📊 Risk Metrics

#### **Value at Risk (VaR)**

- **95% VaR**: Maximum expected loss with 95% confidence
- **99% VaR**: Maximum expected loss with 99% confidence
- **Usage**: Risk management and position sizing

#### **Sharpe Ratio**

- **Formula**: (Return - Risk-free Rate) / Standard Deviation
- **Interpretation**: Risk-adjusted return measurement
- **Higher is Better**: > 1.0 considered good

#### **Maximum Drawdown**

- **Definition**: Largest peak-to-trough decline
- **Usage**: Worst-case scenario analysis
- **Lower is Better**: Indicates capital preservation

#### **Beta Coefficient**

- **Market Beta = 1.0**: Moves with market
- **Beta > 1.0**: More volatile than market
- **Beta < 1.0**: Less volatile than market

## Data Visualization

### 📈 Interactive Charts

- **Line Charts**: Price movements with technical overlays
- **Area Charts**: Volume analysis with gradient fills
- **Responsive Design**: Adapts to different screen sizes
- **Tooltips**: Hover for detailed data points

### 🎨 Color Coding

- **Green**: Positive performance, bullish signals
- **Red**: Negative performance, bearish signals
- **Orange/Yellow**: Warning levels, neutral signals
- **Blue**: Information, technical levels

## Performance Metrics

### 📊 Calculated Values

#### **Volatility Classification**

- **Low**: < 2% daily volatility
- **Moderate**: 2-5% daily volatility
- **High**: 5-10% daily volatility
- **Extreme**: > 10% daily volatility

#### **Liquidity Score (0-10)**

- **Volume Percentile**: 0-5 points based on trading volume
- **Spread Analysis**: 1-5 points based on bid-ask spread estimation
- **Higher Score**: Better liquidity, easier to trade

#### **Performance Periods**

- **Daily**: Single day analysis
- **30-Day Rolling**: Monthly performance trends
- **Historical Context**: Comparison with past periods

## Usage Tips

### 🎯 Best Practices

1. **Compare Multiple Dates**: Open dashboard for different dates to compare performance
2. **Check Technical Signals**: Use RSI and MACD for entry/exit timing
3. **Monitor Risk Levels**: Pay attention to VaR and volatility metrics
4. **Volume Confirmation**: High volume confirms price movements
5. **Trend Analysis**: Use moving averages to identify trend direction

### ⚠️ Important Notes

- **Data Accuracy**: Indicators are calculated from available historical data
- **Market Context**: Consider broader market conditions
- **Risk Management**: Use risk metrics for position sizing
- **Signal Confirmation**: Combine multiple indicators for better decisions

## Customization Options

### 🔧 Configurable Elements

- **Chart Time Periods**: Adjustable historical data range
- **Technical Indicators**: Enable/disable specific indicators
- **Risk Parameters**: Customizable VaR confidence levels
- **Display Preferences**: Color themes and chart types

## Integration with Calendar

### 🔗 Seamless Workflow

- **Date Selection**: Dashboard reflects currently selected calendar date
- **Filter Compatibility**: Respects volatility and volume filters
- **Historical Context**: Shows data in relation to calendar trends
- **Navigation**: Easy switching between dates

## Future Enhancements

### 🚀 Planned Features

- **Custom Indicators**: User-defined technical analysis tools
- **Benchmark Integration**: SPY, BTC dominance comparisons
- **Export Functionality**: PDF reports and CSV data export
- **Alert System**: Threshold-based notifications
- **Portfolio Analysis**: Multi-asset comparison tools

## Technical Implementation

### 🛠️ Built With

- **React Components**: Modular, reusable design
- **Material-UI**: Modern, responsive interface
- **Recharts**: Interactive data visualizations
- **Technical Analysis Library**: Custom-built calculations
- **Performance Optimized**: Memoized calculations and lazy loading

The Data Dashboard Panel transforms the interactive calendar into a comprehensive financial analysis platform, providing professional-grade insights for cryptocurrency market analysis and decision-making.
