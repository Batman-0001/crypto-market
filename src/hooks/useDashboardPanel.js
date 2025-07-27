import { useState, useCallback, useEffect } from "react";

/**
 * Custom hook to manage Data Dashboard Panel state and interactions
 */
export const useDashboardPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [activeSymbol, setActiveSymbol] = useState("BTCUSDT");
  const [marketData, setMarketData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Open dashboard with specific date
  const openDashboard = useCallback((date, symbol = "BTCUSDT") => {
    setSelectedDate(date);
    setSelectedDateRange(null);
    setActiveSymbol(symbol);
    setIsOpen(true);
  }, []);

  // Open dashboard with date range
  const openDashboardWithRange = useCallback(
    (startDate, endDate, symbol = "BTCUSDT") => {
      setSelectedDate(null);
      setSelectedDateRange({ start: startDate, end: endDate });
      setActiveSymbol(symbol);
      setIsOpen(true);
    },
    []
  );

  // Close dashboard
  const closeDashboard = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Fetch market data for selected date/range
  const fetchMarketData = useCallback(async (symbol, date, dateRange) => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual API integration
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data generation based on date/symbol
      const mockData = generateMockData(symbol, date, dateRange);
      setMarketData(mockData);
    } catch (error) {
      console.error("Error fetching market data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generate mock data (replace with real API calls)
  const generateMockData = (symbol, date, dateRange) => {
    const basePrice = symbol.includes("BTC")
      ? 45000
      : symbol.includes("ETH")
      ? 3000
      : 1;
    const variance = basePrice * 0.1;

    return {
      prices: {
        open: basePrice + (Math.random() - 0.5) * variance,
        close: basePrice + (Math.random() - 0.5) * variance,
        high: basePrice + Math.random() * variance,
        low: basePrice - Math.random() * variance,
        change: (Math.random() - 0.5) * 1000,
        changePercent: (Math.random() - 0.5) * 10,
      },
      volume: {
        total: Math.random() * 5000000000,
        normalized: Math.random() * 2,
        avgDaily: Math.random() * 3000000000,
        trend: Math.random() > 0.5 ? "increasing" : "decreasing",
      },
      volatility: {
        current: Math.random() * 5 + 1,
        weekAvg: Math.random() * 4 + 1,
        monthAvg: Math.random() * 4 + 1.5,
        vixLike: Math.random() * 50 + 10,
        standardDev: Math.random() * 2000 + 500,
      },
      liquidity: {
        bidAskSpread: Math.random() * 0.1,
        marketDepth: Math.random() * 40 + 60,
        liquidityScore: Math.random() * 4 + 6,
        orderBookStrength:
          Math.random() > 0.6
            ? "Strong"
            : Math.random() > 0.3
            ? "Medium"
            : "Weak",
      },
      technicalIndicators: {
        sma20: basePrice + (Math.random() - 0.5) * variance * 0.5,
        sma50: basePrice + (Math.random() - 0.5) * variance * 0.7,
        ema12: basePrice + (Math.random() - 0.5) * variance * 0.3,
        rsi: Math.random() * 100,
        macd: {
          line: (Math.random() - 0.5) * 500,
          signal: (Math.random() - 0.5) * 400,
          histogram: (Math.random() - 0.5) * 200,
        },
        bollinger: {
          upper: basePrice + variance * 0.4,
          middle: basePrice,
          lower: basePrice - variance * 0.4,
        },
      },
      performance: {
        daily: (Math.random() - 0.5) * 10,
        weekly: (Math.random() - 0.5) * 20,
        monthly: (Math.random() - 0.5) * 30,
        quarterly: (Math.random() - 0.5) * 50,
        ytd: (Math.random() - 0.5) * 100,
      },
      benchmark: {
        name: "S&P 500",
        correlation: Math.random() * 0.8 + 0.2,
        beta: Math.random() * 1.5 + 0.5,
        alpha: (Math.random() - 0.5) * 30,
        sharpeRatio: Math.random() * 2 + 0.5,
      },
    };
  };

  // Effect to fetch data when date/symbol changes
  useEffect(() => {
    if (isOpen && (selectedDate || selectedDateRange)) {
      fetchMarketData(activeSymbol, selectedDate, selectedDateRange);
    }
  }, [isOpen, selectedDate, selectedDateRange, activeSymbol, fetchMarketData]);

  return {
    // State
    isOpen,
    selectedDate,
    selectedDateRange,
    activeSymbol,
    marketData,
    isLoading,

    // Actions
    openDashboard,
    openDashboardWithRange,
    closeDashboard,
    setActiveSymbol,

    // Utilities
    fetchMarketData,
  };
};

export default useDashboardPanel;
