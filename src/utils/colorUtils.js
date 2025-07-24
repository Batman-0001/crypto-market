/**
 * Utility functions for color calculations and visualizations
 */

/**
 * Color palettes for different data types
 */
export const COLOR_PALETTES = {
  volatility: {
    low: ["#e8f5e8", "#c8e6c9", "#a5d6a7", "#81c784"], // Light to medium green
    medium: ["#fff3e0", "#ffe0b2", "#ffcc80", "#ffb74d"], // Light to medium orange
    high: ["#ffebee", "#ffcdd2", "#ef9a9a", "#e57373"], // Light to medium red
  },
  performance: {
    positive: ["#e8f5e8", "#c8e6c9", "#a5d6a7", "#81c784"], // Green shades
    negative: ["#ffebee", "#ffcdd2", "#ef9a9a", "#e57373"], // Red shades
    neutral: ["#f5f5f5", "#eeeeee", "#e0e0e0", "#bdbdbd"], // Gray shades
  },
  volume: {
    scale: ["#e3f2fd", "#bbdefb", "#90caf9", "#64b5f6", "#42a5f5", "#2196f3"], // Blue gradient
  },
};

/**
 * Get volatility color based on volatility percentage
 * @param {number} volatility - Volatility percentage
 * @param {number} intensity - Color intensity (0-1)
 * @returns {string} CSS color value
 */
export const getVolatilityColor = (volatility, intensity = 0.5) => {
  if (volatility < 2) {
    // Low volatility - green
    const colorIndex = Math.min(Math.floor(intensity * 4), 3);
    return COLOR_PALETTES.volatility.low[colorIndex];
  } else if (volatility < 5) {
    // Medium volatility - orange/yellow
    const colorIndex = Math.min(Math.floor(intensity * 4), 3);
    return COLOR_PALETTES.volatility.medium[colorIndex];
  } else {
    // High volatility - red
    const colorIndex = Math.min(Math.floor(intensity * 4), 3);
    return COLOR_PALETTES.volatility.high[colorIndex];
  }
};

/**
 * Get performance color based on price change
 * @param {number} priceChange - Price change percentage
 * @param {number} intensity - Color intensity (0-1)
 * @returns {string} CSS color value
 */
export const getPerformanceColor = (priceChange, intensity = 0.5) => {
  const colorIndex = Math.min(Math.floor(intensity * 4), 3);

  if (priceChange > 0.5) {
    return COLOR_PALETTES.performance.positive[colorIndex];
  } else if (priceChange < -0.5) {
    return COLOR_PALETTES.performance.negative[colorIndex];
  } else {
    return COLOR_PALETTES.performance.neutral[colorIndex];
  }
};

/**
 * Get volume color based on volume level
 * @param {number} volume - Volume value
 * @param {number} maxVolume - Maximum volume for normalization
 * @returns {string} CSS color value
 */
export const getVolumeColor = (volume, maxVolume) => {
  const normalizedVolume = Math.min(volume / maxVolume, 1);
  const colorIndex = Math.min(Math.floor(normalizedVolume * 6), 5);
  return COLOR_PALETTES.volume.scale[colorIndex];
};

/**
 * Calculate color intensity based on data value and range
 * @param {number} value - Current value
 * @param {number} min - Minimum value in range
 * @param {number} max - Maximum value in range
 * @returns {number} Intensity value between 0 and 1
 */
export const calculateIntensity = (value, min, max) => {
  if (max === min) return 0.5;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
};

/**
 * Generate gradient CSS for volume visualization
 * @param {number} intensity - Intensity value (0-1)
 * @param {string} baseColor - Base color for gradient
 * @returns {string} CSS gradient string
 */
export const generateVolumeGradient = (intensity, baseColor = "#2196f3") => {
  const alpha = Math.max(0.1, intensity);
  return `linear-gradient(45deg, transparent 30%, ${baseColor}${Math.floor(
    alpha * 255
  )
    .toString(16)
    .padStart(2, "0")} 70%)`;
};

/**
 * Get trend arrow color and direction
 * @param {number} priceChange - Price change percentage
 * @returns {Object} Arrow properties
 */
export const getTrendArrow = (priceChange) => {
  if (priceChange > 0.1) {
    return {
      direction: "up",
      color: "#4caf50",
      symbol: "↗",
    };
  } else if (priceChange < -0.1) {
    return {
      direction: "down",
      color: "#f44336",
      symbol: "↘",
    };
  } else {
    return {
      direction: "neutral",
      color: "#9e9e9e",
      symbol: "→",
    };
  }
};

/**
 * Generate pattern CSS for liquidity visualization
 * @param {string} pattern - Pattern type ('dots', 'stripes', 'circles')
 * @param {string} color - Pattern color
 * @param {number} intensity - Pattern intensity
 * @returns {string} CSS background pattern
 */
export const generateLiquidityPattern = (pattern, color, intensity) => {
  const alpha = Math.max(0.1, intensity);
  const colorWithAlpha = `${color}${Math.floor(alpha * 255)
    .toString(16)
    .padStart(2, "0")}`;

  switch (pattern) {
    case "dots":
      return `radial-gradient(circle at 2px 2px, ${colorWithAlpha} 1px, transparent 1px)`;
    case "stripes":
      return `repeating-linear-gradient(45deg, transparent, transparent 2px, ${colorWithAlpha} 2px, ${colorWithAlpha} 4px)`;
    case "circles":
      return `radial-gradient(circle at 50% 50%, ${colorWithAlpha} 30%, transparent 30%)`;
    default:
      return `linear-gradient(to right, transparent, ${colorWithAlpha})`;
  }
};

/**
 * Get heatmap cell style based on multiple data points
 * @param {Object} cellData - Cell data containing volatility, performance, volume
 * @param {Object} dataRanges - Min/max ranges for normalization
 * @returns {Object} CSS style object
 */
export const getHeatmapCellStyle = (cellData, dataRanges) => {
  if (!cellData) {
    return {
      backgroundColor: "#f5f5f5",
      opacity: 0.3,
    };
  }

  const { volatility, performance, volume } = cellData;
  const { volatilityRange, volumeRange } = dataRanges;

  // Primary color based on volatility
  const volatilityIntensity = calculateIntensity(
    volatility,
    volatilityRange.min,
    volatilityRange.max
  );
  const backgroundColor = getVolatilityColor(volatility, volatilityIntensity);

  // Volume pattern overlay
  const volumeIntensity = calculateIntensity(
    volume?.volume || 0,
    volumeRange.min,
    volumeRange.max
  );
  const volumePattern = generateLiquidityPattern(
    "dots",
    "#2196f3",
    volumeIntensity
  );

  // Performance border
  const trendArrow = getTrendArrow(performance?.priceChange || 0);

  return {
    backgroundColor,
    backgroundImage: volumePattern,
    backgroundSize: "8px 8px",
    borderLeft: `3px solid ${trendArrow.color}`,
    position: "relative",
    "&::after": {
      content: `"${trendArrow.symbol}"`,
      position: "absolute",
      top: "2px",
      right: "2px",
      fontSize: "10px",
      color: trendArrow.color,
      fontWeight: "bold",
    },
  };
};

/**
 * Get legend colors for volatility ranges
 * @returns {Array} Array of legend items
 */
export const getVolatilityLegend = () => [
  {
    label: "Low (< 2%)",
    color: COLOR_PALETTES.volatility.low[2],
    range: "0-2%",
  },
  {
    label: "Medium (2-5%)",
    color: COLOR_PALETTES.volatility.medium[2],
    range: "2-5%",
  },
  {
    label: "High (> 5%)",
    color: COLOR_PALETTES.volatility.high[2],
    range: "5%+",
  },
];

/**
 * Get legend colors for performance ranges
 * @returns {Array} Array of legend items
 */
export const getPerformanceLegend = () => [
  {
    label: "Positive",
    color: COLOR_PALETTES.performance.positive[2],
    symbol: "↗",
  },
  {
    label: "Neutral",
    color: COLOR_PALETTES.performance.neutral[2],
    symbol: "→",
  },
  {
    label: "Negative",
    color: COLOR_PALETTES.performance.negative[2],
    symbol: "↘",
  },
];
