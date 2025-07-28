/**
 * Real API Integration Architecture for Interactive Crypto Calendar
 * Handles real-time cryptocurrency data from multiple sources
 */

import axios from "axios";

// API Configuration
export const API_CONFIG = {
  binance: {
    baseUrl: "https://api.binance.com/api/v3",
    endpoints: {
      ticker24hr: "/ticker/24hr",
      klines: "/klines",
      ticker: "/ticker/price",
      bookTicker: "/ticker/bookTicker",
    },
    rateLimits: {
      weight: 1200, // requests per minute
      orders: 10, // orders per second
    },
  },
  coingecko: {
    baseUrl: "https://api.coingecko.com/api/v3",
    endpoints: {
      ping: "/ping",
      coins: "/coins",
      simple: "/simple",
      history: "/coins/{id}/history",
      market_chart: "/coins/{id}/market_chart",
    },
    rateLimits: {
      requests: 50, // requests per minute for free tier
    },
  },
  coinbase: {
    baseUrl: "https://api.pro.coinbase.com",
    endpoints: {
      products: "/products",
      ticker: "/products/{product-id}/ticker",
      candles: "/products/{product-id}/candles",
      stats: "/products/{product-id}/stats",
    },
  },
};

// Symbol mapping between different exchanges
export const SYMBOL_MAPPING = {
  binance: {
    BTC: "BTCUSDT",
    ETH: "ETHUSDT",
    BNB: "BNBUSDT",
    ADA: "ADAUSDT",
    SOL: "SOLUSDT",
    DOT: "DOTUSDT",
    AVAX: "AVAXUSDT",
    MATIC: "MATICUSDT",
  },
  coingecko: {
    BTC: "bitcoin",
    ETH: "ethereum",
    BNB: "binancecoin",
    ADA: "cardano",
    SOL: "solana",
    DOT: "polkadot",
    AVAX: "avalanche-2",
    MATIC: "polygon",
  },
  coinbase: {
    BTC: "BTC-USD",
    ETH: "ETH-USD",
    ADA: "ADA-USD",
    SOL: "SOL-USD",
    DOT: "DOT-USD",
    AVAX: "AVAX-USD",
    MATIC: "MATIC-USD",
  },
};

// Rate limiting manager
class RateLimitManager {
  constructor() {
    this.limits = new Map();
  }

  async checkLimit(api, endpoint) {
    const key = `${api}-${endpoint}`;
    const now = Date.now();
    const limit = this.limits.get(key);

    if (!limit) {
      this.limits.set(key, { count: 1, resetTime: now + 60000 });
      return true;
    }

    if (now > limit.resetTime) {
      this.limits.set(key, { count: 1, resetTime: now + 60000 });
      return true;
    }

    const maxRequests =
      API_CONFIG[api]?.rateLimits?.requests ||
      API_CONFIG[api]?.rateLimits?.weight ||
      50;

    if (limit.count >= maxRequests) {
      const waitTime = limit.resetTime - now;
      throw new Error(
        `Rate limit exceeded. Wait ${Math.ceil(waitTime / 1000)} seconds.`
      );
    }

    limit.count++;
    return true;
  }
}

const rateLimitManager = new RateLimitManager();

// API Client Base Class
class APIClient {
  constructor(config) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error(`API Error (${config.baseUrl}):`, error.message);
        return Promise.reject(error);
      }
    );
  }

  async makeRequest(endpoint, params = {}) {
    try {
      await rateLimitManager.checkLimit(this.config.name, endpoint);
      const response = await this.client.get(endpoint, { params });
      return response.data;
    } catch (error) {
      throw new Error(`${this.config.name} API Error: ${error.message}`);
    }
  }
}

// Binance API Client
class BinanceClient extends APIClient {
  constructor() {
    super({ ...API_CONFIG.binance, name: "binance" });
  }

  async getTicker24hr(symbol = null) {
    const endpoint = this.config.endpoints.ticker24hr;
    const params = symbol
      ? { symbol: SYMBOL_MAPPING.binance[symbol] || symbol }
      : {};
    return this.makeRequest(endpoint, params);
  }

  async getKlines(
    symbol,
    interval = "1d",
    limit = 100,
    startTime = null,
    endTime = null
  ) {
    const endpoint = this.config.endpoints.klines;
    const params = {
      symbol: SYMBOL_MAPPING.binance[symbol] || symbol,
      interval,
      limit,
    };

    if (startTime) params.startTime = startTime;
    if (endTime) params.endTime = endTime;

    const data = await this.makeRequest(endpoint, params);

    // Transform Binance kline data to standard format
    return data.map((kline) => ({
      timestamp: kline[0],
      date: new Date(kline[0]).toISOString().split("T")[0],
      open: parseFloat(kline[1]),
      high: parseFloat(kline[2]),
      low: parseFloat(kline[3]),
      close: parseFloat(kline[4]),
      volume: parseFloat(kline[5]),
      price: parseFloat(kline[4]), // Use close as price
    }));
  }

  async getCurrentPrice(symbol) {
    const endpoint = this.config.endpoints.ticker;
    const params = { symbol: SYMBOL_MAPPING.binance[symbol] || symbol };
    const data = await this.makeRequest(endpoint, params);
    return {
      symbol: data.symbol,
      price: parseFloat(data.price),
      timestamp: Date.now(),
    };
  }
}

// CoinGecko API Client
class CoinGeckoClient extends APIClient {
  constructor() {
    super({ ...API_CONFIG.coingecko, name: "coingecko" });
  }

  async getSimplePrice(ids, vs_currencies = "usd", include_24hr_change = true) {
    const endpoint = `${this.config.endpoints.simple}/price`;
    const params = {
      ids: Array.isArray(ids) ? ids.join(",") : ids,
      vs_currencies,
      include_24hr_change,
      include_24hr_vol: true,
      include_market_cap: true,
    };

    return this.makeRequest(endpoint, params);
  }

  async getMarketChart(id, vs_currency = "usd", days = 30) {
    const coinId = SYMBOL_MAPPING.coingecko[id] || id;
    const endpoint = this.config.endpoints.market_chart.replace("{id}", coinId);
    const params = {
      vs_currency,
      days,
      interval: days > 90 ? "daily" : "hourly",
    };

    const data = await this.makeRequest(endpoint, params);

    // Transform CoinGecko data to standard format
    const prices = data.prices || [];
    const volumes = data.total_volumes || [];

    return prices.map((pricePoint, index) => ({
      timestamp: pricePoint[0],
      date: new Date(pricePoint[0]).toISOString().split("T")[0],
      price: pricePoint[1],
      close: pricePoint[1],
      volume: volumes[index] ? volumes[index][1] : 0,
    }));
  }

  async getCoinHistory(id, date) {
    const coinId = SYMBOL_MAPPING.coingecko[id] || id;
    const endpoint = this.config.endpoints.history.replace("{id}", coinId);
    const params = { date }; // Format: dd-mm-yyyy

    return this.makeRequest(endpoint, params);
  }
}

// Coinbase API Client
class CoinbaseClient extends APIClient {
  constructor() {
    super({ ...API_CONFIG.coinbase, name: "coinbase" });
  }

  async getTicker(productId) {
    const product = SYMBOL_MAPPING.coinbase[productId] || productId;
    const endpoint = this.config.endpoints.ticker.replace(
      "{product-id}",
      product
    );
    return this.makeRequest(endpoint);
  }

  async getCandles(productId, start, end, granularity = 86400) {
    const product = SYMBOL_MAPPING.coinbase[productId] || productId;
    const endpoint = this.config.endpoints.candles.replace(
      "{product-id}",
      product
    );
    const params = { start, end, granularity };

    const data = await this.makeRequest(endpoint, params);

    // Transform Coinbase data to standard format
    return data.map((candle) => ({
      timestamp: candle[0] * 1000,
      date: new Date(candle[0] * 1000).toISOString().split("T")[0],
      low: candle[1],
      high: candle[2],
      open: candle[3],
      close: candle[4],
      volume: candle[5],
      price: candle[4], // Use close as price
    }));
  }
}

// Main API Manager
class CryptoAPIManager {
  constructor() {
    this.binance = new BinanceClient();
    this.coingecko = new CoinGeckoClient();
    this.coinbase = new CoinbaseClient();
    this.cache = new Map();
    this.cacheTimeout = 60000; // 1 minute cache
  }

  // Get cached data or fetch new data
  async getCachedData(key, fetchFunction) {
    const cached = this.cache.get(key);
    const now = Date.now();

    if (cached && now - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const data = await fetchFunction();
      this.cache.set(key, { data, timestamp: now });
      return data;
    } catch (error) {
      // Return cached data if available, even if expired
      if (cached) {
        console.warn("Using stale cached data due to API error");
        return cached.data;
      }
      throw error;
    }
  }

  // Get current price from primary source (Binance) with fallbacks
  async getCurrentPrice(symbol) {
    const cacheKey = `price-${symbol}`;

    return this.getCachedData(cacheKey, async () => {
      try {
        // Try Binance first
        return await this.binance.getCurrentPrice(symbol);
      } catch (error) {
        console.warn("Binance failed, trying CoinGecko:", error.message);

        try {
          // Fallback to CoinGecko
          const coinId = SYMBOL_MAPPING.coingecko[symbol];
          if (coinId) {
            const data = await this.coingecko.getSimplePrice(coinId);
            return {
              symbol,
              price: data[coinId]?.usd || 0,
              timestamp: Date.now(),
            };
          }
        } catch (cgError) {
          console.warn("CoinGecko failed, trying Coinbase:", cgError.message);

          // Last fallback to Coinbase
          const productId = SYMBOL_MAPPING.coinbase[symbol];
          if (productId) {
            const ticker = await this.coinbase.getTicker(productId);
            return {
              symbol,
              price: parseFloat(ticker.price),
              timestamp: Date.now(),
            };
          }
        }

        throw new Error(`Unable to fetch price for ${symbol} from any source`);
      }
    });
  }

  // Get historical data with intelligent source selection
  async getHistoricalData(symbol, days = 30, interval = "1d") {
    const cacheKey = `history-${symbol}-${days}-${interval}`;

    return this.getCachedData(cacheKey, async () => {
      // For recent data (< 365 days), prefer Binance for better granularity
      if (days <= 365) {
        try {
          const limit = Math.min(days, 1000);
          return await this.binance.getKlines(symbol, interval, limit);
        } catch (error) {
          console.warn(
            "Binance historical data failed, trying CoinGecko:",
            error.message
          );
        }
      }

      // Fallback to CoinGecko for longer periods or if Binance fails
      try {
        const coinId = SYMBOL_MAPPING.coingecko[symbol];
        if (coinId) {
          return await this.coingecko.getMarketChart(coinId, "usd", days);
        }
      } catch (error) {
        console.warn("CoinGecko historical data failed:", error.message);
      }

      // Last resort: generate mock data
      console.warn(`Generating mock data for ${symbol}`);
      return this.generateMockData(symbol, days);
    });
  }

  // Get market overview data
  async getMarketOverview(symbols = ["BTC", "ETH", "BNB", "ADA", "SOL"]) {
    const cacheKey = `market-overview-${symbols.join(",")}`;

    return this.getCachedData(cacheKey, async () => {
      try {
        // Use Binance for 24hr ticker data
        const tickers = await this.binance.getTicker24hr();

        return symbols.map((symbol) => {
          const binanceSymbol = SYMBOL_MAPPING.binance[symbol];
          const ticker = Array.isArray(tickers)
            ? tickers.find((t) => t.symbol === binanceSymbol)
            : tickers.symbol === binanceSymbol
            ? tickers
            : null;

          if (ticker) {
            return {
              symbol,
              price: parseFloat(ticker.lastPrice),
              change24h: parseFloat(ticker.priceChangePercent),
              volume24h: parseFloat(ticker.volume),
              high24h: parseFloat(ticker.highPrice),
              low24h: parseFloat(ticker.lowPrice),
            };
          }

          return {
            symbol,
            price: 0,
            change24h: 0,
            volume24h: 0,
            high24h: 0,
            low24h: 0,
          };
        });
      } catch (error) {
        console.warn(
          "Market overview failed, using fallback data:",
          error.message
        );

        // Fallback to individual price requests
        const promises = symbols.map(async (symbol) => {
          try {
            const price = await this.getCurrentPrice(symbol);
            return {
              symbol,
              price: price.price,
              change24h: 0, // Cannot get 24h change from individual requests
              volume24h: 0,
              high24h: 0,
              low24h: 0,
            };
          } catch (err) {
            return {
              symbol,
              price: 0,
              change24h: 0,
              volume24h: 0,
              high24h: 0,
              low24h: 0,
            };
          }
        });

        return Promise.all(promises);
      }
    });
  }

  // Generate mock data for development/fallback
  generateMockData(symbol, days) {
    const basePrice =
      { BTC: 45000, ETH: 3000, BNB: 400, ADA: 0.5, SOL: 100 }[symbol] || 100;
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // Add some randomness to the price
      const volatility = 0.05; // 5% daily volatility
      const change = (Math.random() - 0.5) * 2 * volatility;
      const price = basePrice * (1 + (change * (days - i)) / days);

      data.push({
        date: date.toISOString().split("T")[0],
        timestamp: date.getTime(),
        price: Math.max(price, 0.01),
        close: Math.max(price, 0.01),
        volume: Math.random() * 1000000,
        high: price * 1.02,
        low: price * 0.98,
        open: price * (0.99 + Math.random() * 0.02),
      });
    }

    return data;
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Get API health status
  async getAPIHealth() {
    const status = {
      binance: "unknown",
      coingecko: "unknown",
      coinbase: "unknown",
      timestamp: Date.now(),
    };

    // Test Binance
    try {
      await this.binance.makeRequest("/ping");
      status.binance = "healthy";
    } catch (error) {
      status.binance = "unhealthy";
    }

    // Test CoinGecko
    try {
      await this.coingecko.makeRequest("/ping");
      status.coingecko = "healthy";
    } catch (error) {
      status.coingecko = "unhealthy";
    }

    // Test Coinbase
    try {
      await this.coinbase.makeRequest("/products");
      status.coinbase = "healthy";
    } catch (error) {
      status.coinbase = "unhealthy";
    }

    return status;
  }
}

// Create singleton instance
export const cryptoAPI = new CryptoAPIManager();

// WebSocket Manager for real-time data
class WebSocketManager {
  constructor() {
    this.connections = new Map();
    this.subscribers = new Map();
  }

  // Subscribe to real-time price updates
  subscribeToPrice(symbol, callback) {
    const key = `price-${symbol}`;

    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }

    this.subscribers.get(key).add(callback);

    // Start WebSocket connection if not already connected
    if (!this.connections.has(key)) {
      this.startPriceStream(symbol);
    }
  }

  // Unsubscribe from price updates
  unsubscribeFromPrice(symbol, callback) {
    const key = `price-${symbol}`;
    const subs = this.subscribers.get(key);

    if (subs) {
      subs.delete(callback);

      // Close connection if no more subscribers
      if (subs.size === 0) {
        this.stopPriceStream(symbol);
      }
    }
  }

  // Start WebSocket price stream (Binance)
  startPriceStream(symbol) {
    const key = `price-${symbol}`;
    const binanceSymbol =
      SYMBOL_MAPPING.binance[symbol]?.toLowerCase() || symbol.toLowerCase();
    const wsUrl = `wss://stream.binance.com:9443/ws/${binanceSymbol}@ticker`;

    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log(`WebSocket connected for ${symbol}`);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const priceData = {
            symbol,
            price: parseFloat(data.c),
            change24h: parseFloat(data.P),
            volume24h: parseFloat(data.v),
            timestamp: data.E,
          };

          // Notify all subscribers
          const subs = this.subscribers.get(key);
          if (subs) {
            subs.forEach((callback) => callback(priceData));
          }
        } catch (error) {
          console.error("WebSocket message parsing error:", error);
        }
      };

      ws.onerror = (error) => {
        console.error(`WebSocket error for ${symbol}:`, error);
      };

      ws.onclose = () => {
        console.log(`WebSocket closed for ${symbol}`);
        this.connections.delete(key);

        // Attempt to reconnect after 5 seconds if there are still subscribers
        const subs = this.subscribers.get(key);
        if (subs && subs.size > 0) {
          setTimeout(() => this.startPriceStream(symbol), 5000);
        }
      };

      this.connections.set(key, ws);
    } catch (error) {
      console.error(`Failed to start WebSocket for ${symbol}:`, error);
    }
  }

  // Stop WebSocket price stream
  stopPriceStream(symbol) {
    const key = `price-${symbol}`;
    const ws = this.connections.get(key);

    if (ws) {
      ws.close();
      this.connections.delete(key);
    }
  }

  // Close all connections
  closeAll() {
    this.connections.forEach((ws) => ws.close());
    this.connections.clear();
    this.subscribers.clear();
  }
}

// Create singleton WebSocket manager
export const wsManager = new WebSocketManager();

// Export for use in components
export default cryptoAPI;
