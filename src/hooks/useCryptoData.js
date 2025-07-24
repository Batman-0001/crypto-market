import { useState, useEffect, useCallback, useRef } from "react";
import cryptoDataService from "../services/cryptoDataService";
import {
  DEFAULT_SYMBOL,
  VIEW_TYPES,
  REFRESH_INTERVALS,
  LOADING_STATES,
} from "../constants";

/**
 * Custom hook for managing cryptocurrency market data
 * @param {string} symbol - Cryptocurrency symbol
 * @param {string} viewType - Calendar view type
 * @returns {Object} Hook state and methods
 */
export const useCryptoData = (
  symbol = DEFAULT_SYMBOL,
  viewType = VIEW_TYPES.DAILY
) => {
  // State management
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(LOADING_STATES.IDLE);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [dataRanges, setDataRanges] = useState({
    volatilityRange: { min: 0, max: 10 },
    volumeRange: { min: 0, max: 1000000 },
    priceRange: { min: 0, max: 100000 },
  });

  // Refs for cleanup and interval management
  const intervalRef = useRef(null);
  const abortControllerRef = useRef(null);

  /**
   * Calculate data ranges for normalization
   * @param {Array} marketData - Array of market data
   * @returns {Object} Data ranges object
   */
  const calculateDataRanges = useCallback((marketData) => {
    if (!marketData || marketData.length === 0) {
      return {
        volatilityRange: { min: 0, max: 10 },
        volumeRange: { min: 0, max: 1000000 },
        priceRange: { min: 0, max: 100000 },
      };
    }

    const volatilities = marketData.map((item) => item.volatility || 0);
    const volumes = marketData.map((item) => item.volume || 0);
    const prices = marketData.map((item) => item.close || 0);

    return {
      volatilityRange: {
        min: Math.min(...volatilities),
        max: Math.max(...volatilities),
      },
      volumeRange: {
        min: Math.min(...volumes),
        max: Math.max(...volumes),
      },
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices),
      },
    };
  }, []);

  /**
   * Fetch cryptocurrency data based on current parameters
   */
  const fetchData = useCallback(async () => {
    if (!symbol) return;

    try {
      setLoading(LOADING_STATES.LOADING);
      setError(null);

      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      // Determine the number of days based on view type
      const days =
        viewType === VIEW_TYPES.MONTHLY
          ? 365
          : viewType === VIEW_TYPES.WEEKLY
          ? 90
          : 30;

      // Fetch calendar data
      const marketData = await cryptoDataService.getCalendarData(
        symbol,
        viewType,
        days
      );

      // Calculate data ranges for visualization
      const ranges = calculateDataRanges(marketData);

      setData(marketData);
      setDataRanges(ranges);
      setLastUpdated(new Date());
      setLoading(LOADING_STATES.SUCCESS);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Error fetching crypto data:", err);
        setError(err.message || "Failed to fetch cryptocurrency data");
        setLoading(LOADING_STATES.ERROR);
      }
    }
  }, [symbol, viewType, calculateDataRanges]);

  /**
   * Fetch additional ticker data for real-time updates
   */
  const fetchTickerData = useCallback(async () => {
    if (!symbol) return;

    try {
      const tickerData = await cryptoDataService.get24hrTicker(symbol);

      // Update the most recent data point with latest ticker info
      setData((prevData) => {
        if (prevData.length === 0) return prevData;

        const updatedData = [...prevData];
        const lastIndex = updatedData.length - 1;

        if (updatedData[lastIndex]) {
          updatedData[lastIndex] = {
            ...updatedData[lastIndex],
            close: parseFloat(tickerData.lastPrice),
            volume: parseFloat(tickerData.volume),
            priceChange: parseFloat(tickerData.priceChangePercent),
          };
        }

        return updatedData;
      });

      setLastUpdated(new Date());
    } catch (err) {
      console.warn("Error fetching ticker data:", err);
      // Don't set error state for ticker updates, just log warning
    }
  }, [symbol]);

  /**
   * Refresh data manually
   */
  const refreshData = useCallback(() => {
    fetchData();
  }, [fetchData]);

  /**
   * Start auto-refresh interval
   */
  const startAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      fetchTickerData();
    }, REFRESH_INTERVALS.TICKER);
  }, [fetchTickerData]);

  /**
   * Stop auto-refresh interval
   */
  const stopAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  /**
   * Get data for a specific date
   * @param {Date} date - Target date
   * @returns {Object|null} Data for the specified date
   */
  const getDataForDate = useCallback(
    (date) => {
      if (!data || data.length === 0) return null;

      return data.find((item) => {
        const itemDate = new Date(item.date);
        return itemDate.toDateString() === date.toDateString();
      });
    },
    [data]
  );

  /**
   * Get aggregated data for a date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Object} Aggregated data
   */
  const getAggregatedData = useCallback(
    (startDate, endDate) => {
      if (!data || data.length === 0) return null;

      const filteredData = data.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });

      if (filteredData.length === 0) return null;

      return {
        avgVolatility:
          filteredData.reduce((sum, item) => sum + (item.volatility || 0), 0) /
          filteredData.length,
        totalVolume: filteredData.reduce(
          (sum, item) => sum + (item.volume || 0),
          0
        ),
        avgPriceChange:
          filteredData.reduce((sum, item) => sum + (item.priceChange || 0), 0) /
          filteredData.length,
        count: filteredData.length,
        dateRange: { start: startDate, end: endDate },
      };
    },
    [data]
  );

  // Effect for initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Effect for managing auto-refresh
  useEffect(() => {
    startAutoRefresh();

    return () => {
      stopAutoRefresh();
    };
  }, [startAutoRefresh, stopAutoRefresh]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      stopAutoRefresh();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [stopAutoRefresh]);

  return {
    // Data state
    data,
    loading,
    error,
    lastUpdated,
    dataRanges,

    // Methods
    refreshData,
    fetchData,
    getDataForDate,
    getAggregatedData,
    startAutoRefresh,
    stopAutoRefresh,

    // Loading states
    isLoading: loading === LOADING_STATES.LOADING,
    isSuccess: loading === LOADING_STATES.SUCCESS,
    isError: loading === LOADING_STATES.ERROR,
    isIdle: loading === LOADING_STATES.IDLE,
  };
};
