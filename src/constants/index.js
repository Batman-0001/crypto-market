/**
 * Application constants and configuration
 * Now using environment variables for sensitive data
 */
import { ENV_CONFIG } from "../utils/envConfig";

// Calendar view types
export const VIEW_TYPES = {
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
};

// Supported cryptocurrency symbols
export const CRYPTO_SYMBOLS = [
  { symbol: "BTCUSDT", name: "Bitcoin", shortName: "BTC" },
  { symbol: "ETHUSDT", name: "Ethereum", shortName: "ETH" },
  { symbol: "ADAUSDT", name: "Cardano", shortName: "ADA" },
  { symbol: "DOTUSDT", name: "Polkadot", shortName: "DOT" },
  { symbol: "LINKUSDT", name: "Chainlink", shortName: "LINK" },
  { symbol: "LTCUSDT", name: "Litecoin", shortName: "LTC" },
  { symbol: "XRPUSDT", name: "Ripple", shortName: "XRP" },
  { symbol: "BCHUSDT", name: "Bitcoin Cash", shortName: "BCH" },
];

// Default cryptocurrency symbol (from environment)
export const DEFAULT_SYMBOL = ENV_CONFIG.DEFAULT_CRYPTO_SYMBOL;

// Volatility thresholds
export const VOLATILITY_THRESHOLDS = {
  LOW: 2,
  MEDIUM: 5,
  HIGH: 10,
};

// Performance thresholds
export const PERFORMANCE_THRESHOLDS = {
  SIGNIFICANT_POSITIVE: 2,
  SLIGHT_POSITIVE: 0.5,
  NEUTRAL: 0.5,
  SLIGHT_NEGATIVE: -0.5,
  SIGNIFICANT_NEGATIVE: -2,
};

// Calendar navigation keys
export const KEYBOARD_KEYS = {
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ENTER: "Enter",
  ESCAPE: "Escape",
  SPACE: " ",
};

// Animation durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

// API refresh intervals (from environment variables)
export const REFRESH_INTERVALS = ENV_CONFIG.REFRESH_INTERVALS;

// Chart colors
export const CHART_COLORS = {
  PRIMARY: "#1976d2",
  SECONDARY: "#dc004e",
  SUCCESS: "#4caf50",
  WARNING: "#ff9800",
  ERROR: "#f44336",
  INFO: "#2196f3",
};

// Liquidity patterns
export const LIQUIDITY_PATTERNS = {
  DOTS: "dots",
  STRIPES: "stripes",
  CIRCLES: "circles",
  GRADIENT: "gradient",
};

// Data aggregation periods
export const AGGREGATION_PERIODS = {
  HOUR: "1h",
  DAY: "1d",
  WEEK: "1w",
  MONTH: "1M",
};

// Calendar cell dimensions
export const CELL_DIMENSIONS = {
  MIN_HEIGHT: 60,
  MAX_HEIGHT: 120,
  MIN_WIDTH: 80,
  MAX_WIDTH: 150,
};

// Tooltip positions
export const TOOLTIP_POSITIONS = {
  TOP: "top",
  BOTTOM: "bottom",
  LEFT: "left",
  RIGHT: "right",
};

// Error messages
export const ERROR_MESSAGES = {
  API_ERROR: "Failed to fetch cryptocurrency data. Please try again.",
  NETWORK_ERROR:
    "Network connection error. Please check your internet connection.",
  INVALID_SYMBOL: "Invalid cryptocurrency symbol selected.",
  DATA_PROCESSING_ERROR: "Error processing market data.",
  GENERAL_ERROR: "An unexpected error occurred. Please refresh the page.",
};

// Loading states
export const LOADING_STATES = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

// Local storage keys
export const STORAGE_KEYS = {
  SELECTED_SYMBOL: "crypto_calendar_selected_symbol",
  VIEW_TYPE: "crypto_calendar_view_type",
  THEME_PREFERENCE: "crypto_calendar_theme",
  USER_PREFERENCES: "crypto_calendar_preferences",
};

// Default user preferences
export const DEFAULT_PREFERENCES = {
  symbol: DEFAULT_SYMBOL,
  viewType: VIEW_TYPES.DAILY,
  autoRefresh: true,
  showVolatilityHeatmap: true,
  showLiquidityIndicators: true,
  showPerformanceMetrics: true,
  enableKeyboardNavigation: true,
  enableTooltips: true,
};

// Calendar week days
export const WEEK_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Month names
export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Chart configuration
export const CHART_CONFIG = {
  MARGIN: { top: 20, right: 30, left: 20, bottom: 5 },
  GRID_STROKE: "#e0e0e0",
  AXIS_STROKE: "#757575",
  TOOLTIP_BACKGROUND: "#ffffff",
  TOOLTIP_BORDER: "#cccccc",
};
