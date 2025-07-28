/**
 * Data Comparison Utilities for Interactive Crypto Calendar
 * Enables side-by-side comparison of different time periods and cryptocurrencies
 */

import { format, differenceInDays, startOfDay, endOfDay } from "date-fns";

// Compare two time periods for the same cryptocurrency
export const compareTimePeriods = (baseData, compareData, symbol) => {
  if (!baseData || !compareData) {
    return null;
  }

  const calculateMetrics = (data) => {
    if (!data || data.length === 0) return null;

    const prices = data.map((d) => d.price || d.close || 0);
    const volumes = data.map((d) => d.volume || 0);

    const startPrice = prices[0];
    const endPrice = prices[prices.length - 1];
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const totalVolume = volumes.reduce((sum, vol) => sum + vol, 0);
    const avgVolume = totalVolume / volumes.length;

    // Calculate volatility (standard deviation of returns)
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      if (prices[i - 1] !== 0) {
        returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
      }
    }

    const avgReturn =
      returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const volatility =
      Math.sqrt(
        returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) /
          returns.length
      ) * 100;

    return {
      startPrice,
      endPrice,
      maxPrice,
      minPrice,
      totalReturn: ((endPrice - startPrice) / startPrice) * 100,
      totalVolume,
      avgVolume,
      volatility: volatility || 0,
      dataPoints: data.length,
      priceRange: maxPrice - minPrice,
      priceRangePercent: ((maxPrice - minPrice) / startPrice) * 100,
    };
  };

  const baseMetrics = calculateMetrics(baseData);
  const compareMetrics = calculateMetrics(compareData);

  if (!baseMetrics || !compareMetrics) {
    return null;
  }

  return {
    symbol,
    basePeriod: {
      metrics: baseMetrics,
      data: baseData,
    },
    comparePeriod: {
      metrics: compareMetrics,
      data: compareData,
    },
    differences: {
      returnDifference: baseMetrics.totalReturn - compareMetrics.totalReturn,
      volumeDifference: baseMetrics.totalVolume - compareMetrics.totalVolume,
      volatilityDifference: baseMetrics.volatility - compareMetrics.volatility,
      priceRangeDifference:
        baseMetrics.priceRangePercent - compareMetrics.priceRangePercent,
    },
    ratios: {
      returnRatio:
        compareMetrics.totalReturn !== 0
          ? baseMetrics.totalReturn / compareMetrics.totalReturn
          : null,
      volumeRatio:
        compareMetrics.totalVolume !== 0
          ? baseMetrics.totalVolume / compareMetrics.totalVolume
          : null,
      volatilityRatio:
        compareMetrics.volatility !== 0
          ? baseMetrics.volatility / compareMetrics.volatility
          : null,
    },
  };
};

// Compare multiple cryptocurrencies for the same time period
export const compareCryptocurrencies = (cryptoDataMap, timeframe) => {
  const symbols = Object.keys(cryptoDataMap);

  if (symbols.length < 2) {
    return null;
  }

  const comparisons = [];

  symbols.forEach((symbol) => {
    const data = cryptoDataMap[symbol];
    if (!data || data.length === 0) return;

    const prices = data.map((d) => d.price || d.close || 0);
    const volumes = data.map((d) => d.volume || 0);

    const startPrice = prices[0];
    const endPrice = prices[prices.length - 1];
    const totalReturn = ((endPrice - startPrice) / startPrice) * 100;
    const totalVolume = volumes.reduce((sum, vol) => sum + vol, 0);

    // Calculate Sharpe ratio (simplified)
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      if (prices[i - 1] !== 0) {
        returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
      }
    }

    const avgReturn =
      returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const volatility = Math.sqrt(
      returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) /
        returns.length
    );

    const sharpeRatio = volatility !== 0 ? avgReturn / volatility : 0;

    comparisons.push({
      symbol,
      totalReturn,
      totalVolume,
      volatility: volatility * 100,
      sharpeRatio,
      startPrice,
      endPrice,
      maxPrice: Math.max(...prices),
      minPrice: Math.min(...prices),
      dataPoints: data.length,
    });
  });

  // Sort by performance
  comparisons.sort((a, b) => b.totalReturn - a.totalReturn);

  return {
    timeframe,
    cryptocurrencies: comparisons,
    summary: {
      bestPerformer: comparisons[0],
      worstPerformer: comparisons[comparisons.length - 1],
      avgReturn:
        comparisons.reduce((sum, crypto) => sum + crypto.totalReturn, 0) /
        comparisons.length,
      avgVolatility:
        comparisons.reduce((sum, crypto) => sum + crypto.volatility, 0) /
        comparisons.length,
      totalVolume: comparisons.reduce(
        (sum, crypto) => sum + crypto.totalVolume,
        0
      ),
    },
  };
};

// Generate comparison insights and recommendations
export const generateComparisonInsights = (comparison) => {
  const insights = [];

  if (comparison.basePeriod && comparison.comparePeriod) {
    // Time period comparison insights
    const { differences, ratios } = comparison;

    if (Math.abs(differences.returnDifference) > 5) {
      insights.push({
        type: "performance",
        severity:
          Math.abs(differences.returnDifference) > 20 ? "high" : "medium",
        message:
          differences.returnDifference > 0
            ? `Current period showing ${differences.returnDifference.toFixed(
                2
              )}% better performance`
            : `Previous period performed ${Math.abs(
                differences.returnDifference
              ).toFixed(2)}% better`,
        value: differences.returnDifference,
      });
    }

    if (Math.abs(differences.volatilityDifference) > 2) {
      insights.push({
        type: "volatility",
        severity:
          Math.abs(differences.volatilityDifference) > 10 ? "high" : "medium",
        message:
          differences.volatilityDifference > 0
            ? `Volatility increased by ${differences.volatilityDifference.toFixed(
                2
              )}%`
            : `Volatility decreased by ${Math.abs(
                differences.volatilityDifference
              ).toFixed(2)}%`,
        value: differences.volatilityDifference,
      });
    }

    if (
      ratios.volumeRatio &&
      (ratios.volumeRatio > 2 || ratios.volumeRatio < 0.5)
    ) {
      insights.push({
        type: "volume",
        severity:
          ratios.volumeRatio > 3 || ratios.volumeRatio < 0.3
            ? "high"
            : "medium",
        message:
          ratios.volumeRatio > 1
            ? `Trading volume increased by ${(
                (ratios.volumeRatio - 1) *
                100
              ).toFixed(0)}%`
            : `Trading volume decreased by ${(
                (1 - ratios.volumeRatio) *
                100
              ).toFixed(0)}%`,
        value: ratios.volumeRatio,
      });
    }
  } else if (comparison.cryptocurrencies) {
    // Multi-crypto comparison insights
    const { summary, cryptocurrencies } = comparison;

    insights.push({
      type: "performance",
      severity: "info",
      message: `${
        summary.bestPerformer.symbol
      } leads with ${summary.bestPerformer.totalReturn.toFixed(2)}% return`,
      value: summary.bestPerformer.totalReturn,
    });

    const performanceSpread =
      summary.bestPerformer.totalReturn - summary.worstPerformer.totalReturn;
    if (performanceSpread > 10) {
      insights.push({
        type: "divergence",
        severity: performanceSpread > 30 ? "high" : "medium",
        message: `High performance divergence: ${performanceSpread.toFixed(
          2
        )}% spread between top and bottom performers`,
        value: performanceSpread,
      });
    }

    // Find high-volatility assets
    const highVolAssets = cryptocurrencies.filter(
      (crypto) => crypto.volatility > summary.avgVolatility * 1.5
    );
    if (highVolAssets.length > 0) {
      insights.push({
        type: "volatility",
        severity: "medium",
        message: `${
          highVolAssets.length
        } asset(s) showing high volatility: ${highVolAssets
          .map((a) => a.symbol)
          .join(", ")}`,
        value: highVolAssets.length,
      });
    }
  }

  return insights;
};

// Create comparison chart data
export const createComparisonChartData = (comparison) => {
  if (!comparison) return null;

  if (comparison.basePeriod && comparison.comparePeriod) {
    // Time period comparison chart
    const baseData = comparison.basePeriod.data.map((point, index) => ({
      index,
      date: point.date,
      baseValue: point.price || point.close,
      baseName: "Current Period",
    }));

    const compareData = comparison.comparePeriod.data.map((point, index) => ({
      index,
      date: point.date,
      compareValue: point.price || point.close,
      compareName: "Previous Period",
    }));

    // Normalize data to same length if needed
    const minLength = Math.min(baseData.length, compareData.length);

    return Array.from({ length: minLength }, (_, i) => ({
      index: i,
      baseValue: baseData[i]?.baseValue || 0,
      compareValue: compareData[i]?.compareValue || 0,
      baseName: "Current Period",
      compareName: "Previous Period",
    }));
  } else if (comparison.cryptocurrencies) {
    // Multi-crypto comparison chart
    return comparison.cryptocurrencies.map((crypto) => ({
      symbol: crypto.symbol,
      return: crypto.totalReturn,
      volatility: crypto.volatility,
      volume: crypto.totalVolume,
      sharpeRatio: crypto.sharpeRatio,
      startPrice: crypto.startPrice,
      endPrice: crypto.endPrice,
    }));
  }

  return null;
};

// Export comparison data
export const exportComparisonData = (comparison, format = "csv") => {
  if (!comparison) return null;

  const data = [];

  if (comparison.basePeriod && comparison.comparePeriod) {
    // Time period comparison export
    data.push(["Metric", "Current Period", "Previous Period", "Difference"]);
    data.push([
      "Total Return (%)",
      comparison.basePeriod.metrics.totalReturn.toFixed(2),
      comparison.comparePeriod.metrics.totalReturn.toFixed(2),
      comparison.differences.returnDifference.toFixed(2),
    ]);
    data.push([
      "Volatility (%)",
      comparison.basePeriod.metrics.volatility.toFixed(2),
      comparison.comparePeriod.metrics.volatility.toFixed(2),
      comparison.differences.volatilityDifference.toFixed(2),
    ]);
    data.push([
      "Total Volume",
      comparison.basePeriod.metrics.totalVolume.toFixed(0),
      comparison.comparePeriod.metrics.totalVolume.toFixed(0),
      comparison.differences.volumeDifference.toFixed(0),
    ]);
  } else if (comparison.cryptocurrencies) {
    // Multi-crypto comparison export
    data.push([
      "Symbol",
      "Return (%)",
      "Volatility (%)",
      "Volume",
      "Sharpe Ratio",
      "Start Price",
      "End Price",
    ]);
    comparison.cryptocurrencies.forEach((crypto) => {
      data.push([
        crypto.symbol,
        crypto.totalReturn.toFixed(2),
        crypto.volatility.toFixed(2),
        crypto.totalVolume.toFixed(0),
        crypto.sharpeRatio.toFixed(4),
        crypto.startPrice.toFixed(4),
        crypto.endPrice.toFixed(4),
      ]);
    });
  }

  if (format === "csv") {
    return data.map((row) => row.join(",")).join("\n");
  } else if (format === "json") {
    return JSON.stringify(comparison, null, 2);
  }

  return data;
};

// Utility functions for comparison UI
export const getComparisonColor = (value, isPositive = true) => {
  if (value === 0) return "#757575";
  if (isPositive) {
    return value > 0 ? "#4caf50" : "#f44336";
  } else {
    return value > 0 ? "#f44336" : "#4caf50";
  }
};

export const formatComparisonValue = (value, type = "percent") => {
  if (value === null || value === undefined) return "N/A";

  switch (type) {
    case "percent":
      return `${value.toFixed(2)}%`;
    case "currency":
      return `$${value.toFixed(2)}`;
    case "volume":
      if (value > 1e9) return `${(value / 1e9).toFixed(2)}B`;
      if (value > 1e6) return `${(value / 1e6).toFixed(2)}M`;
      if (value > 1e3) return `${(value / 1e3).toFixed(2)}K`;
      return value.toFixed(0);
    case "ratio":
      return `${value.toFixed(2)}x`;
    default:
      return value.toFixed(2);
  }
};
