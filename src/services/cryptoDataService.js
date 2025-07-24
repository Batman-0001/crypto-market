import axios from "axios";
import { ENV_CONFIG, getApiHeaders, isDevelopment } from "../utils/envConfig";

/**
 * Service for fetching cryptocurrency market data from Binance API
 * Now uses environment variables for configuration
 */
class CryptoDataService {
  constructor() {
    this.currentApiIndex = 0;
    this.apiEndpoints = [
      ENV_CONFIG.CRYPTO_API_BASE_URL,
      ...ENV_CONFIG.FALLBACK_APIS,
    ];

    this.api = axios.create({
      baseURL: ENV_CONFIG.CRYPTO_API_BASE_URL,
      timeout: ENV_CONFIG.CRYPTO_API_TIMEOUT,
      headers: getApiHeaders(),
    });

    // Add request interceptor for rate limiting and logging
    this.api.interceptors.request.use(
      (config) => {
        if (ENV_CONFIG.FEATURES.ENABLE_DEBUG_LOGGING) {
          console.log(
            `🔗 API Request: ${config.method?.toUpperCase()} ${config.url}`
          );
        }
        return config;
      },
      (error) => {
        console.error("API Request Error:", error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling and fallback
    this.api.interceptors.response.use(
      (response) => {
        if (ENV_CONFIG.FEATURES.ENABLE_DEBUG_LOGGING) {
          console.log(
            `✅ API Response: ${response.status} ${response.config.url}`
          );
        }
        return response;
      },
      async (error) => {
        if (isDevelopment()) {
          console.error("API Error:", error.message);
        }

        // Try fallback API if main API fails
        if (
          error.config &&
          !error.config._retry &&
          this.apiEndpoints.length > 1
        ) {
          return this.retryWithFallback(error.config);
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Retry API call with fallback endpoint
   * @param {Object} config - Original request config
   * @returns {Promise} Retry response
   */
  async retryWithFallback(config) {
    this.currentApiIndex =
      (this.currentApiIndex + 1) % this.apiEndpoints.length;
    const fallbackUrl = this.apiEndpoints[this.currentApiIndex];

    if (ENV_CONFIG.FEATURES.ENABLE_DEBUG_LOGGING) {
      console.log(`🔄 Retrying with fallback API: ${fallbackUrl}`);
    }

    config._retry = true;
    config.baseURL = fallbackUrl;

    return this.api(config);
  }

  /**
   * Get 24hr ticker price change statistics for a symbol
   * @param {string} symbol - Trading pair symbol (e.g., 'BTCUSDT')
   * @returns {Promise} API response with price data
   */
  async get24hrTicker(symbol = "BTCUSDT") {
    try {
      const response = await this.api.get("/ticker/24hr", {
        params: { symbol },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching 24hr ticker:", error);
      throw error;
    }
  }

  /**
   * Get historical kline/candlestick data
   * @param {string} symbol - Trading pair symbol
   * @param {string} interval - Kline interval (1d, 1w, 1M)
   * @param {number} limit - Number of data points to return
   * @returns {Promise} Array of kline data
   */
  async getKlineData(symbol = "BTCUSDT", interval = "1d", limit = 30) {
    try {
      const response = await this.api.get("/klines", {
        params: {
          symbol,
          interval,
          limit,
        },
      });

      // Transform kline data to more readable format
      return response.data.map((kline) => ({
        openTime: new Date(kline[0]),
        open: parseFloat(kline[1]),
        high: parseFloat(kline[2]),
        low: parseFloat(kline[3]),
        close: parseFloat(kline[4]),
        volume: parseFloat(kline[5]),
        closeTime: new Date(kline[6]),
        quoteAssetVolume: parseFloat(kline[7]),
        numberOfTrades: parseInt(kline[8]),
        takerBuyBaseAssetVolume: parseFloat(kline[9]),
        takerBuyQuoteAssetVolume: parseFloat(kline[10]),
      }));
    } catch (error) {
      console.error("Error fetching kline data:", error);
      throw error;
    }
  }

  /**
   * Get orderbook depth data
   * @param {string} symbol - Trading pair symbol
   * @param {number} limit - Depth limit (5, 10, 20, 50, 100, 500, 1000, 5000)
   * @returns {Promise} Orderbook data
   */
  async getOrderBook(symbol = "BTCUSDT", limit = 100) {
    try {
      const response = await this.api.get("/depth", {
        params: {
          symbol,
          limit,
        },
      });

      return {
        lastUpdateId: response.data.lastUpdateId,
        bids: response.data.bids.map((bid) => ({
          price: parseFloat(bid[0]),
          quantity: parseFloat(bid[1]),
        })),
        asks: response.data.asks.map((ask) => ({
          price: parseFloat(ask[0]),
          quantity: parseFloat(ask[1]),
        })),
      };
    } catch (error) {
      console.error("Error fetching orderbook:", error);
      throw error;
    }
  }

  /**
   * Get multiple symbols' 24hr ticker data
   * @param {Array} symbols - Array of trading pair symbols
   * @returns {Promise} Array of ticker data
   */
  async getMultipleTickers(
    symbols = ["BTCUSDT", "ETHUSDT", "ADAUSDT", "DOTUSDT"]
  ) {
    try {
      const promises = symbols.map((symbol) => this.get24hrTicker(symbol));
      return await Promise.all(promises);
    } catch (error) {
      console.error("Error fetching multiple tickers:", error);
      throw error;
    }
  }

  /**
   * Calculate volatility based on price data
   * @param {Array} priceData - Array of price data points
   * @returns {number} Volatility percentage
   */
  calculateVolatility(priceData) {
    if (!priceData || priceData.length < 2) return 0;

    const returns = [];
    for (let i = 1; i < priceData.length; i++) {
      const currentPrice = priceData[i].close;
      const previousPrice = priceData[i - 1].close;
      const returnValue = (currentPrice - previousPrice) / previousPrice;
      returns.push(returnValue);
    }

    // Calculate standard deviation of returns
    const mean = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const variance =
      returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) /
      returns.length;
    const standardDeviation = Math.sqrt(variance);

    // Convert to percentage
    return standardDeviation * 100;
  }

  /**
   * Get aggregated market data for calendar visualization
   * @param {string} symbol - Trading pair symbol
   * @param {string} timeframe - Time frame ('daily', 'weekly', 'monthly')
   * @param {number} days - Number of days to fetch
   * @returns {Promise} Processed market data
   */
  async getCalendarData(symbol = "BTCUSDT", timeframe = "daily", days = 30) {
    try {
      const interval =
        timeframe === "weekly" ? "1w" : timeframe === "monthly" ? "1M" : "1d";
      const limit = timeframe === "monthly" ? 12 : days;

      const klineData = await this.getKlineData(symbol, interval, limit);
      const volatility = this.calculateVolatility(klineData);

      // Process the data first
      const processedData = klineData.map((data) => ({
        date: data.openTime,
        open: data.open,
        high: data.high,
        low: data.low,
        close: data.close,
        volume: data.volume,
        priceChange: ((data.close - data.open) / data.open) * 100,
        volatility: this.calculateDayVolatility(data),
        liquidity: this.calculateLiquidity(data),
        performance: this.getPerformanceIndicator(data),
      }));

      // Calculate volume percentiles for filtering
      const volumes = processedData.map((d) => d.volume).sort((a, b) => a - b);
      const enhancedData = processedData.map((data) => ({
        ...data,
        volumePercentile: this.calculateVolumePercentile(data.volume, volumes),
      }));

      return enhancedData;
    } catch (error) {
      console.error("Error fetching calendar data:", error);
      throw error;
    }
  }

  /**
   * Calculate daily volatility
   * @param {Object} dayData - Single day's market data
   * @returns {number} Daily volatility percentage
   */
  calculateDayVolatility(dayData) {
    const range = dayData.high - dayData.low;
    const average = (dayData.high + dayData.low) / 2;
    return (range / average) * 100;
  }

  /**
   * Calculate liquidity metric
   * @param {Object} dayData - Single day's market data
   * @returns {Object} Liquidity metrics
   */
  calculateLiquidity(dayData) {
    return {
      volume: dayData.volume,
      volumeNormalized: dayData.volume / dayData.close, // Volume/Price ratio
      trades: dayData.numberOfTrades || 0,
    };
  }

  /**
   * Get performance indicator
   * @param {Object} dayData - Single day's market data
   * @returns {Object} Performance metrics
   */
  getPerformanceIndicator(dayData) {
    const priceChange = ((dayData.close - dayData.open) / dayData.open) * 100;

    return {
      priceChange,
      direction: priceChange > 0 ? "up" : priceChange < 0 ? "down" : "neutral",
      magnitude: Math.abs(priceChange),
    };
  }

  /**
   * Calculate volume percentile for a given volume value
   * @param {number} volume - Volume value to calculate percentile for
   * @param {Array} sortedVolumes - Array of all volumes sorted ascending
   * @returns {number} Percentile (0-100)
   */
  calculateVolumePercentile(volume, sortedVolumes) {
    const index = sortedVolumes.findIndex((v) => v >= volume);
    if (index === -1) return 100;
    return Math.round((index / sortedVolumes.length) * 100);
  }

  /**
   * Filter market data based on criteria
   * @param {Array} data - Market data array
   * @param {Object} filters - Filter criteria
   * @returns {Array} Filtered data
   */
  filterMarketData(data, filters = {}) {
    if (!data || !Array.isArray(data)) return [];

    return data.filter((item) => {
      // Volatility filter
      if (filters.volatilityRange) {
        const [minVol, maxVol] = filters.volatilityRange;
        if (item.volatility < minVol || item.volatility > maxVol) {
          return false;
        }
      }

      // Volume percentile filter
      if (filters.volumeRange && item.volumePercentile !== undefined) {
        const [minVolPercentile, maxVolPercentile] = filters.volumeRange;
        if (
          item.volumePercentile < minVolPercentile ||
          item.volumePercentile > maxVolPercentile
        ) {
          return false;
        }
      }

      return true;
    });
  }
}

export default new CryptoDataService();
