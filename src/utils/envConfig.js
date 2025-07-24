/**
 * Environment configuration utility
 * Handles loading and validation of environment variables
 */

/**
 * Get environment variable with fallback
 * @param {string} key - Environment variable key
 * @param {any} defaultValue - Default value if env var is not set
 * @returns {any} Environment variable value or default
 */
const getEnvVar = (key, defaultValue) => {
  const value = import.meta.env[key];

  // Handle boolean strings
  if (value === "true") return true;
  if (value === "false") return false;

  // Handle numeric strings
  if (value && !isNaN(value)) return Number(value);

  return value || defaultValue;
};

/**
 * Environment configuration object
 */
export const ENV_CONFIG = {
  // API Configuration
  CRYPTO_API_BASE_URL: getEnvVar(
    "VITE_CRYPTO_API_BASE_URL",
    "https://api.binance.com/api/v3"
  ),
  CRYPTO_API_TIMEOUT: getEnvVar("VITE_CRYPTO_API_TIMEOUT", 10000),

  // API Authentication (optional)
  BINANCE_API_KEY: getEnvVar("VITE_BINANCE_API_KEY", null),
  BINANCE_SECRET_KEY: getEnvVar("VITE_BINANCE_SECRET_KEY", null),

  // Rate Limiting
  API_RATE_LIMIT_REQUESTS: getEnvVar("VITE_API_RATE_LIMIT_REQUESTS", 1200),
  API_RATE_LIMIT_WINDOW: getEnvVar("VITE_API_RATE_LIMIT_WINDOW", 60000),

  // Refresh Intervals
  REFRESH_INTERVALS: {
    ORDERBOOK: getEnvVar("VITE_REFRESH_INTERVAL_ORDERBOOK", 5000),
    TICKER: getEnvVar("VITE_REFRESH_INTERVAL_TICKER", 10000),
    HISTORICAL: getEnvVar("VITE_REFRESH_INTERVAL_HISTORICAL", 60000),
  },

  // Default Settings
  DEFAULT_CRYPTO_SYMBOL: getEnvVar("VITE_DEFAULT_CRYPTO_SYMBOL", "BTCUSDT"),
  DEFAULT_VIEW_TYPE: getEnvVar("VITE_DEFAULT_VIEW_TYPE", "daily"),

  // Feature Toggles
  FEATURES: {
    ENABLE_ORDERBOOK_DATA: getEnvVar("VITE_ENABLE_ORDERBOOK_DATA", true),
    ENABLE_WEBSOCKET_UPDATES: getEnvVar("VITE_ENABLE_WEBSOCKET_UPDATES", false),
    ENABLE_DEBUG_LOGGING: getEnvVar("VITE_ENABLE_DEBUG_LOGGING", false),
  },

  // Fallback APIs
  FALLBACK_APIS: [
    getEnvVar("VITE_FALLBACK_API_1", "https://api1.binance.com/api/v3"),
    getEnvVar("VITE_FALLBACK_API_2", "https://api2.binance.com/api/v3"),
    getEnvVar("VITE_FALLBACK_API_3", "https://api3.binance.com/api/v3"),
  ].filter(Boolean), // Remove null/undefined values
};

/**
 * Validate required environment variables
 * @returns {Object} Validation result
 */
export const validateEnvironment = () => {
  const errors = [];
  const warnings = [];

  // Check required variables
  if (!ENV_CONFIG.CRYPTO_API_BASE_URL) {
    errors.push("VITE_CRYPTO_API_BASE_URL is required");
  }

  // Check for valid URL format
  try {
    new URL(ENV_CONFIG.CRYPTO_API_BASE_URL);
  } catch (error) {
    errors.push("VITE_CRYPTO_API_BASE_URL must be a valid URL");
  }

  // Check timeout is reasonable
  if (
    ENV_CONFIG.CRYPTO_API_TIMEOUT < 1000 ||
    ENV_CONFIG.CRYPTO_API_TIMEOUT > 30000
  ) {
    warnings.push("VITE_CRYPTO_API_TIMEOUT should be between 1000-30000ms");
  }

  // Check refresh intervals
  const { ORDERBOOK, TICKER, HISTORICAL } = ENV_CONFIG.REFRESH_INTERVALS;
  if (ORDERBOOK < 1000)
    warnings.push("Orderbook refresh interval too low (< 1s)");
  if (TICKER < 5000) warnings.push("Ticker refresh interval too low (< 5s)");
  if (HISTORICAL < 30000)
    warnings.push("Historical refresh interval too low (< 30s)");

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Log environment configuration (for debugging)
 */
export const logEnvironmentConfig = () => {
  if (!ENV_CONFIG.FEATURES.ENABLE_DEBUG_LOGGING) return;

  console.group("🔧 Environment Configuration");
  console.log("API Base URL:", ENV_CONFIG.CRYPTO_API_BASE_URL);
  console.log("API Timeout:", ENV_CONFIG.CRYPTO_API_TIMEOUT + "ms");
  console.log("Default Symbol:", ENV_CONFIG.DEFAULT_CRYPTO_SYMBOL);
  console.log("Default View:", ENV_CONFIG.DEFAULT_VIEW_TYPE);
  console.log("Features:", ENV_CONFIG.FEATURES);
  console.log("Refresh Intervals:", ENV_CONFIG.REFRESH_INTERVALS);
  console.log("Fallback APIs:", ENV_CONFIG.FALLBACK_APIS.length);
  console.groupEnd();
};

/**
 * Get API headers (including authentication if available)
 * @returns {Object} Headers object
 */
export const getApiHeaders = () => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // Add API key if available (for authenticated endpoints)
  if (ENV_CONFIG.BINANCE_API_KEY) {
    headers["X-MBX-APIKEY"] = ENV_CONFIG.BINANCE_API_KEY;
  }

  return headers;
};

/**
 * Check if environment is development
 * @returns {boolean} True if in development mode
 */
export const isDevelopment = () => {
  return import.meta.env.DEV;
};

/**
 * Check if environment is production
 * @returns {boolean} True if in production mode
 */
export const isProduction = () => {
  return import.meta.env.PROD;
};

// Validate environment on import (in development)
if (isDevelopment()) {
  const validation = validateEnvironment();

  if (!validation.isValid) {
    console.error("❌ Environment Validation Errors:", validation.errors);
  }

  if (validation.warnings.length > 0) {
    console.warn("⚠️ Environment Warnings:", validation.warnings);
  }

  logEnvironmentConfig();
}
