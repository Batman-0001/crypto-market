/**
 * Historical Pattern Recognition for Interactive Crypto Calendar
 * Identifies patterns, trends, and anomalies in cryptocurrency data
 */

import { differenceInDays, format, startOfDay, endOfDay } from "date-fns";

// Pattern types
export const PATTERN_TYPES = {
  TREND: "trend",
  SUPPORT_RESISTANCE: "support_resistance",
  VOLATILITY_CLUSTER: "volatility_cluster",
  VOLUME_SPIKE: "volume_spike",
  PRICE_GAP: "price_gap",
  SEASONAL: "seasonal",
  CORRELATION: "correlation",
  ANOMALY: "anomaly",
};

// Trend patterns
export const TREND_PATTERNS = {
  BULLISH: "bullish",
  BEARISH: "bearish",
  SIDEWAYS: "sideways",
  BREAKOUT: "breakout",
  REVERSAL: "reversal",
};

// Anomaly types
export const ANOMALY_TYPES = {
  PRICE_SPIKE: "price_spike",
  VOLUME_ANOMALY: "volume_anomaly",
  VOLATILITY_SURGE: "volatility_surge",
  UNUSUAL_PATTERN: "unusual_pattern",
  DATA_GAP: "data_gap",
};

// Moving average calculation
const calculateMovingAverage = (data, period) => {
  const result = [];
  for (let i = period - 1; i < data.length; i++) {
    const sum = data
      .slice(i - period + 1, i + 1)
      .reduce((acc, val) => acc + val, 0);
    result.push(sum / period);
  }
  return result;
};

// Calculate price volatility
const calculateVolatility = (prices, period = 20) => {
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    if (prices[i - 1] !== 0) {
      returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
    }
  }

  const volatilities = [];
  for (let i = period - 1; i < returns.length; i++) {
    const periodReturns = returns.slice(i - period + 1, i + 1);
    const mean = periodReturns.reduce((sum, ret) => sum + ret, 0) / period;
    const variance =
      periodReturns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) /
      period;
    volatilities.push(Math.sqrt(variance) * Math.sqrt(252) * 100); // Annualized volatility
  }

  return volatilities;
};

// Detect trend patterns
export const detectTrendPatterns = (data, lookbackDays = 30) => {
  if (!data || data.length < lookbackDays) return [];

  const prices = data.map((d) => d.price || d.close || 0);
  const volumes = data.map((d) => d.volume || 0);
  const dates = data.map((d) => d.date);

  const patterns = [];

  // Calculate moving averages
  const ma5 = calculateMovingAverage(prices, 5);
  const ma20 = calculateMovingAverage(prices, 20);
  const ma50 = calculateMovingAverage(prices, Math.min(50, prices.length));

  // Detect bullish/bearish trends
  for (let i = Math.max(20, lookbackDays); i < prices.length; i++) {
    const recentPrices = prices.slice(i - lookbackDays, i);
    const priceChange =
      (recentPrices[recentPrices.length - 1] - recentPrices[0]) /
      recentPrices[0];

    // Linear regression for trend strength
    const xValues = Array.from({ length: lookbackDays }, (_, idx) => idx);
    const yValues = recentPrices;
    const n = lookbackDays;
    const sumX = xValues.reduce((sum, x) => sum + x, 0);
    const sumY = yValues.reduce((sum, y) => sum + y, 0);
    const sumXY = xValues.reduce((sum, x, idx) => sum + x * yValues[idx], 0);
    const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const correlation = Math.abs(slope) / Math.max(Math.abs(priceChange), 0.01);

    if (Math.abs(priceChange) > 0.05 && correlation > 0.5) {
      // 5% change threshold
      const pattern = {
        type: PATTERN_TYPES.TREND,
        subtype:
          priceChange > 0 ? TREND_PATTERNS.BULLISH : TREND_PATTERNS.BEARISH,
        startDate: dates[i - lookbackDays],
        endDate: dates[i - 1],
        strength: Math.min(Math.abs(priceChange) * 10, 1), // 0-1 scale
        confidence: correlation,
        data: {
          priceChange: priceChange * 100,
          slope,
          startPrice: recentPrices[0],
          endPrice: recentPrices[recentPrices.length - 1],
        },
      };
      patterns.push(pattern);
    }
  }

  // Detect breakouts
  for (let i = 20; i < prices.length; i++) {
    if (ma5[i - 20] && ma20[i - 20] && ma50[i - 20]) {
      const currentPrice = prices[i];
      const recent20High = Math.max(...prices.slice(i - 20, i));
      const recent20Low = Math.min(...prices.slice(i - 20, i));

      if (currentPrice > recent20High * 1.02) {
        // 2% above recent high
        patterns.push({
          type: PATTERN_TYPES.TREND,
          subtype: TREND_PATTERNS.BREAKOUT,
          startDate: dates[i - 1],
          endDate: dates[i],
          strength: (currentPrice - recent20High) / recent20High,
          confidence: 0.8,
          data: {
            breakoutLevel: recent20High,
            currentPrice,
            percentAbove: ((currentPrice - recent20High) / recent20High) * 100,
          },
        });
      }
    }
  }

  return patterns;
};

// Detect support and resistance levels
export const detectSupportResistance = (data, period = 20, minTouches = 3) => {
  if (!data || data.length < period * 2) return [];

  const prices = data.map((d) => d.price || d.close || 0);
  const highs = data.map((d) => d.high || d.price || d.close || 0);
  const lows = data.map((d) => d.low || d.price || d.close || 0);
  const dates = data.map((d) => d.date);

  const levels = [];

  // Find local maxima and minima
  const peaks = [];
  const troughs = [];

  for (let i = period; i < prices.length - period; i++) {
    const currentHigh = highs[i];
    const currentLow = lows[i];

    // Check if current point is a peak
    const isPeak = highs
      .slice(i - period, i + period + 1)
      .every((h) => h <= currentHigh);
    if (isPeak) {
      peaks.push({ index: i, price: currentHigh, date: dates[i] });
    }

    // Check if current point is a trough
    const isTrough = lows
      .slice(i - period, i + period + 1)
      .every((l) => l >= currentLow);
    if (isTrough) {
      troughs.push({ index: i, price: currentLow, date: dates[i] });
    }
  }

  // Group similar price levels
  const groupLevels = (points, type) => {
    const groups = [];
    const tolerance = 0.02; // 2% tolerance

    points.forEach((point) => {
      let addedToGroup = false;

      for (let group of groups) {
        const avgPrice =
          group.prices.reduce((sum, p) => sum + p, 0) / group.prices.length;
        if (Math.abs(point.price - avgPrice) / avgPrice < tolerance) {
          group.prices.push(point.price);
          group.dates.push(point.date);
          group.indices.push(point.index);
          addedToGroup = true;
          break;
        }
      }

      if (!addedToGroup) {
        groups.push({
          prices: [point.price],
          dates: [point.date],
          indices: [point.index],
          type,
        });
      }
    });

    return groups.filter((group) => group.prices.length >= minTouches);
  };

  const resistanceLevels = groupLevels(peaks, "resistance");
  const supportLevels = groupLevels(troughs, "support");

  [...resistanceLevels, ...supportLevels].forEach((level) => {
    const avgPrice =
      level.prices.reduce((sum, p) => sum + p, 0) / level.prices.length;
    const strength = level.prices.length / minTouches; // Relative strength

    levels.push({
      type: PATTERN_TYPES.SUPPORT_RESISTANCE,
      subtype: level.type,
      price: avgPrice,
      touches: level.prices.length,
      strength: Math.min(strength, 1),
      confidence: strength > 1 ? 0.8 : 0.6,
      dates: level.dates,
      data: {
        touchPrices: level.prices,
        priceRange: {
          min: Math.min(...level.prices),
          max: Math.max(...level.prices),
        },
      },
    });
  });

  return levels;
};

// Detect volatility clusters
export const detectVolatilityClusters = (
  data,
  period = 10,
  threshold = 1.5
) => {
  if (!data || data.length < period * 2) return [];

  const prices = data.map((d) => d.price || d.close || 0);
  const dates = data.map((d) => d.date);
  const volatilities = calculateVolatility(prices, period);

  const clusters = [];
  const avgVolatility =
    volatilities.reduce((sum, vol) => sum + vol, 0) / volatilities.length;

  let clusterStart = null;
  let clusterValues = [];

  volatilities.forEach((vol, i) => {
    if (vol > avgVolatility * threshold) {
      if (!clusterStart) {
        clusterStart = i;
        clusterValues = [vol];
      } else {
        clusterValues.push(vol);
      }
    } else {
      if (clusterStart !== null && clusterValues.length >= 3) {
        const clusterEnd = i - 1;
        const avgClusterVol =
          clusterValues.reduce((sum, v) => sum + v, 0) / clusterValues.length;

        clusters.push({
          type: PATTERN_TYPES.VOLATILITY_CLUSTER,
          startDate: dates[clusterStart + period - 1],
          endDate: dates[clusterEnd + period - 1],
          avgVolatility: avgClusterVol,
          maxVolatility: Math.max(...clusterValues),
          strength: (avgClusterVol - avgVolatility) / avgVolatility,
          confidence: clusterValues.length > 5 ? 0.8 : 0.6,
          data: {
            baselineVolatility: avgVolatility,
            clusterVolatilities: clusterValues,
            duration: clusterValues.length,
          },
        });
      }
      clusterStart = null;
      clusterValues = [];
    }
  });

  return clusters;
};

// Detect volume spikes
export const detectVolumeSpikes = (data, threshold = 2.0) => {
  if (!data || data.length < 20) return [];

  const volumes = data.map((d) => d.volume || 0);
  const dates = data.map((d) => d.date);

  const spikes = [];
  const avgVolume = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;

  volumes.forEach((vol, i) => {
    if (vol > avgVolume * threshold) {
      spikes.push({
        type: PATTERN_TYPES.VOLUME_SPIKE,
        date: dates[i],
        volume: vol,
        baselineVolume: avgVolume,
        multiplier: vol / avgVolume,
        strength: Math.min((vol - avgVolume) / avgVolume, 3), // Cap at 3x
        confidence: vol > avgVolume * 3 ? 0.9 : 0.7,
        data: {
          percentAboveAverage: ((vol - avgVolume) / avgVolume) * 100,
        },
      });
    }
  });

  return spikes;
};

// Detect anomalies
export const detectAnomalies = (data, sensitivityLevel = 2) => {
  if (!data || data.length < 30) return [];

  const prices = data.map((d) => d.price || d.close || 0);
  const volumes = data.map((d) => d.volume || 0);
  const dates = data.map((d) => d.date);

  const anomalies = [];

  // Price anomalies using Z-score
  const avgPrice =
    prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const priceStdDev = Math.sqrt(
    prices.reduce((sum, price) => sum + Math.pow(price - avgPrice, 2), 0) /
      prices.length
  );

  prices.forEach((price, i) => {
    const zScore = Math.abs((price - avgPrice) / priceStdDev);
    if (zScore > sensitivityLevel) {
      anomalies.push({
        type: PATTERN_TYPES.ANOMALY,
        subtype: ANOMALY_TYPES.PRICE_SPIKE,
        date: dates[i],
        value: price,
        zScore,
        strength: Math.min(zScore / 3, 1),
        confidence: zScore > 3 ? 0.9 : 0.7,
        data: {
          baseline: avgPrice,
          standardDeviation: priceStdDev,
          deviationPercent: ((price - avgPrice) / avgPrice) * 100,
        },
      });
    }
  });

  // Volume anomalies
  const avgVolume = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;
  const volumeStdDev = Math.sqrt(
    volumes.reduce((sum, vol) => sum + Math.pow(vol - avgVolume, 2), 0) /
      volumes.length
  );

  volumes.forEach((volume, i) => {
    const zScore = Math.abs((volume - avgVolume) / volumeStdDev);
    if (zScore > sensitivityLevel && volume > avgVolume) {
      anomalies.push({
        type: PATTERN_TYPES.ANOMALY,
        subtype: ANOMALY_TYPES.VOLUME_ANOMALY,
        date: dates[i],
        value: volume,
        zScore,
        strength: Math.min(zScore / 3, 1),
        confidence: zScore > 3 ? 0.9 : 0.7,
        data: {
          baseline: avgVolume,
          standardDeviation: volumeStdDev,
          multiplier: volume / avgVolume,
        },
      });
    }
  });

  return anomalies;
};

// Detect seasonal patterns
export const detectSeasonalPatterns = (data, symbol) => {
  if (!data || data.length < 365) return []; // Need at least 1 year of data

  const patterns = [];
  const monthlyReturns = {};
  const weeklyReturns = {};

  // Group data by month and day of week
  data.forEach((point, i) => {
    if (i === 0) return;

    const date = new Date(point.date);
    const month = date.getMonth();
    const dayOfWeek = date.getDay();

    const prevPrice = data[i - 1].price || data[i - 1].close || 0;
    const currentPrice = point.price || point.close || 0;

    if (prevPrice > 0) {
      const dailyReturn = (currentPrice - prevPrice) / prevPrice;

      // Monthly patterns
      if (!monthlyReturns[month]) monthlyReturns[month] = [];
      monthlyReturns[month].push(dailyReturn);

      // Weekly patterns
      if (!weeklyReturns[dayOfWeek]) weeklyReturns[dayOfWeek] = [];
      weeklyReturns[dayOfWeek].push(dailyReturn);
    }
  });

  // Analyze monthly patterns
  Object.entries(monthlyReturns).forEach(([month, returns]) => {
    if (returns.length >= 20) {
      // Minimum sample size
      const avgReturn =
        returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
      const stdDev = Math.sqrt(
        returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) /
          returns.length
      );

      if (Math.abs(avgReturn) > stdDev * 0.5) {
        // Significant pattern
        patterns.push({
          type: PATTERN_TYPES.SEASONAL,
          subtype: "monthly",
          period: parseInt(month),
          periodName: new Date(2023, month, 1).toLocaleString("default", {
            month: "long",
          }),
          avgReturn: avgReturn * 100,
          confidence: Math.min(Math.abs(avgReturn) / stdDev, 1),
          sampleSize: returns.length,
          data: {
            standardDeviation: stdDev * 100,
            isPositive: avgReturn > 0,
          },
        });
      }
    }
  });

  return patterns;
};

// Comprehensive pattern analysis
export const analyzePatterns = (data, symbol, options = {}) => {
  const {
    detectTrends = true,
    detectSupportResistance: enableSupportResistance = true,
    detectVolatilityClusters: enableVolatilityClusters = true,
    detectVolumeSpikes: enableVolumeSpikes = true,
    detectAnomalies: enableAnomalies = true,
    detectSeasonal: enableSeasonal = false, // Requires more data
    lookbackDays = 30,
  } = options;

  const allPatterns = [];

  if (detectTrends) {
    allPatterns.push(...detectTrendPatterns(data, lookbackDays));
  }

  if (enableSupportResistance) {
    allPatterns.push(...detectSupportResistance(data));
  }

  if (enableVolatilityClusters) {
    allPatterns.push(...detectVolatilityClusters(data));
  }

  if (enableVolumeSpikes) {
    allPatterns.push(...detectVolumeSpikes(data));
  }

  if (enableAnomalies) {
    allPatterns.push(...detectAnomalies(data));
  }

  if (enableSeasonal && data.length >= 365) {
    allPatterns.push(...detectSeasonalPatterns(data, symbol));
  }

  // Sort by confidence and recency
  allPatterns.sort((a, b) => {
    const scoreA = a.confidence * 0.7 + (a.strength || 0) * 0.3;
    const scoreB = b.confidence * 0.7 + (b.strength || 0) * 0.3;
    return scoreB - scoreA;
  });

  return {
    symbol,
    totalPatterns: allPatterns.length,
    patterns: allPatterns,
    summary: {
      trends: allPatterns.filter((p) => p.type === PATTERN_TYPES.TREND).length,
      supportResistance: allPatterns.filter(
        (p) => p.type === PATTERN_TYPES.SUPPORT_RESISTANCE
      ).length,
      volatilityClusters: allPatterns.filter(
        (p) => p.type === PATTERN_TYPES.VOLATILITY_CLUSTER
      ).length,
      volumeSpikes: allPatterns.filter(
        (p) => p.type === PATTERN_TYPES.VOLUME_SPIKE
      ).length,
      anomalies: allPatterns.filter((p) => p.type === PATTERN_TYPES.ANOMALY)
        .length,
      seasonal: allPatterns.filter((p) => p.type === PATTERN_TYPES.SEASONAL)
        .length,
    },
  };
};

// Pattern utility functions
export const getPatternIcon = (pattern) => {
  switch (pattern.type) {
    case PATTERN_TYPES.TREND:
      return pattern.subtype === TREND_PATTERNS.BULLISH
        ? "📈"
        : pattern.subtype === TREND_PATTERNS.BEARISH
        ? "📉"
        : "➡️";
    case PATTERN_TYPES.SUPPORT_RESISTANCE:
      return pattern.subtype === "support" ? "🔻" : "🔺";
    case PATTERN_TYPES.VOLATILITY_CLUSTER:
      return "⚡";
    case PATTERN_TYPES.VOLUME_SPIKE:
      return "📊";
    case PATTERN_TYPES.ANOMALY:
      return "🔍";
    case PATTERN_TYPES.SEASONAL:
      return "📅";
    default:
      return "📌";
  }
};

export const getPatternColor = (pattern) => {
  switch (pattern.type) {
    case PATTERN_TYPES.TREND:
      return pattern.subtype === TREND_PATTERNS.BULLISH
        ? "#4caf50"
        : pattern.subtype === TREND_PATTERNS.BEARISH
        ? "#f44336"
        : "#2196f3";
    case PATTERN_TYPES.SUPPORT_RESISTANCE:
      return "#ff9800";
    case PATTERN_TYPES.VOLATILITY_CLUSTER:
      return "#9c27b0";
    case PATTERN_TYPES.VOLUME_SPIKE:
      return "#00bcd4";
    case PATTERN_TYPES.ANOMALY:
      return "#ff5722";
    case PATTERN_TYPES.SEASONAL:
      return "#795548";
    default:
      return "#757575";
  }
};

export const formatPatternDescription = (pattern) => {
  switch (pattern.type) {
    case PATTERN_TYPES.TREND:
      return `${
        pattern.subtype.charAt(0).toUpperCase() + pattern.subtype.slice(1)
      } trend detected`;
    case PATTERN_TYPES.SUPPORT_RESISTANCE:
      return `${
        pattern.subtype.charAt(0).toUpperCase() + pattern.subtype.slice(1)
      } level at $${pattern.price?.toFixed(2)}`;
    case PATTERN_TYPES.VOLATILITY_CLUSTER:
      return `High volatility period (${pattern.avgVolatility?.toFixed(1)}%)`;
    case PATTERN_TYPES.VOLUME_SPIKE:
      return `Volume spike (${pattern.multiplier?.toFixed(1)}x average)`;
    case PATTERN_TYPES.ANOMALY:
      return `${pattern.subtype.replace("_", " ")} detected`;
    case PATTERN_TYPES.SEASONAL:
      return `Seasonal pattern in ${pattern.periodName}`;
    default:
      return "Pattern detected";
  }
};
