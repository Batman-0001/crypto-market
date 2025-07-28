/**
 * Color Schemes for Interactive Crypto Calendar
 * Provides multiple accessible color themes
 */

// Default color scheme
export const defaultTheme = {
  name: "Default",
  id: "default",
  colors: {
    primary: "#1976d2",
    secondary: "#dc004e",
    success: "#00e676",
    error: "#ff1744",
    warning: "#ff9800",
    background: "#ffffff",
    surface: "#f5f5f5",
    text: {
      primary: "#212121",
      secondary: "#757575",
      disabled: "#bdbdbd",
    },
    heatmap: {
      low: "#c8e6c9",
      medium: "#66bb6a",
      high: "#2e7d32",
      extreme: "#1b5e20",
    },
    volatility: {
      veryLow: "#e8f5e8",
      low: "#a5d6a7",
      medium: "#66bb6a",
      high: "#43a047",
      veryHigh: "#2e7d32",
      extreme: "#1b5e20",
    },
    performance: {
      strongBull: "#00c853",
      bull: "#00e676",
      neutral: "#757575",
      bear: "#ff5722",
      strongBear: "#d32f2f",
    },
  },
};

// High contrast theme for accessibility
export const highContrastTheme = {
  name: "High Contrast",
  id: "high-contrast",
  colors: {
    primary: "#000000",
    secondary: "#ffffff",
    success: "#00ff00",
    error: "#ff0000",
    warning: "#ffff00",
    background: "#ffffff",
    surface: "#f0f0f0",
    text: {
      primary: "#000000",
      secondary: "#333333",
      disabled: "#666666",
    },
    heatmap: {
      low: "#ffffff",
      medium: "#cccccc",
      high: "#666666",
      extreme: "#000000",
    },
    volatility: {
      veryLow: "#ffffff",
      low: "#e0e0e0",
      medium: "#b0b0b0",
      high: "#606060",
      veryHigh: "#303030",
      extreme: "#000000",
    },
    performance: {
      strongBull: "#00ff00",
      bull: "#80ff80",
      neutral: "#808080",
      bear: "#ff8080",
      strongBear: "#ff0000",
    },
  },
};

// Colorblind-friendly theme (Deuteranopia/Protanopia)
export const colorblindFriendlyTheme = {
  name: "Colorblind Friendly",
  id: "colorblind-friendly",
  colors: {
    primary: "#0173b2",
    secondary: "#cc78bc",
    success: "#029e73",
    error: "#d55e00",
    warning: "#ece133",
    background: "#ffffff",
    surface: "#f8f9fa",
    text: {
      primary: "#212529",
      secondary: "#6c757d",
      disabled: "#adb5bd",
    },
    heatmap: {
      low: "#fee8c8",
      medium: "#fdbb84",
      high: "#e34a33",
      extreme: "#b30000",
    },
    volatility: {
      veryLow: "#f0f9ff",
      low: "#bae6fd",
      medium: "#7dd3fc",
      high: "#0ea5e9",
      veryHigh: "#0284c7",
      extreme: "#0369a1",
    },
    performance: {
      strongBull: "#029e73",
      bull: "#42b883",
      neutral: "#6c757d",
      bear: "#fd7f28",
      strongBear: "#d55e00",
    },
  },
};

// Dark theme
export const darkTheme = {
  name: "Dark Mode",
  id: "dark",
  colors: {
    primary: "#90caf9",
    secondary: "#f48fb1",
    success: "#00e676",
    error: "#ff5252",
    warning: "#ffb74d",
    background: "#121212",
    surface: "#1e1e1e",
    text: {
      primary: "#ffffff",
      secondary: "#b3b3b3",
      disabled: "#666666",
    },
    heatmap: {
      low: "#1a3d2e",
      medium: "#2d5a47",
      high: "#4caf50",
      extreme: "#66bb6a",
    },
    volatility: {
      veryLow: "#1a1a2e",
      low: "#16213e",
      medium: "#0f3460",
      high: "#533483",
      veryHigh: "#7209b7",
      extreme: "#a663cc",
    },
    performance: {
      strongBull: "#00e676",
      bull: "#4caf50",
      neutral: "#757575",
      bear: "#ff5722",
      strongBear: "#f44336",
    },
  },
};

// Monochrome theme
export const monochromeTheme = {
  name: "Monochrome",
  id: "monochrome",
  colors: {
    primary: "#424242",
    secondary: "#757575",
    success: "#616161",
    error: "#212121",
    warning: "#9e9e9e",
    background: "#fafafa",
    surface: "#f5f5f5",
    text: {
      primary: "#212121",
      secondary: "#424242",
      disabled: "#bdbdbd",
    },
    heatmap: {
      low: "#f5f5f5",
      medium: "#e0e0e0",
      high: "#9e9e9e",
      extreme: "#424242",
    },
    volatility: {
      veryLow: "#fafafa",
      low: "#f0f0f0",
      medium: "#e0e0e0",
      high: "#bdbdbd",
      veryHigh: "#757575",
      extreme: "#424242",
    },
    performance: {
      strongBull: "#212121",
      bull: "#424242",
      neutral: "#757575",
      bear: "#9e9e9e",
      strongBear: "#bdbdbd",
    },
  },
};

// Collect all themes
export const colorThemes = {
  default: defaultTheme,
  "high-contrast": highContrastTheme,
  "colorblind-friendly": colorblindFriendlyTheme,
  dark: darkTheme,
  monochrome: monochromeTheme,
};

// Theme utilities
export const getTheme = (themeId) => {
  return colorThemes[themeId] || defaultTheme;
};

export const getThemeNames = () => {
  return Object.keys(colorThemes).map((id) => ({
    id,
    name: colorThemes[id].name,
  }));
};

// Color utility functions
export const getVolatilityColor = (volatility, theme = defaultTheme) => {
  const { colors } = theme;
  if (volatility < 1) return colors.volatility.veryLow;
  if (volatility < 3) return colors.volatility.low;
  if (volatility < 7) return colors.volatility.medium;
  if (volatility < 15) return colors.volatility.high;
  if (volatility < 25) return colors.volatility.veryHigh;
  return colors.volatility.extreme;
};

export const getPerformanceColor = (changePercent, theme = defaultTheme) => {
  const { colors } = theme;
  if (changePercent > 5) return colors.performance.strongBull;
  if (changePercent > 0) return colors.performance.bull;
  if (changePercent === 0) return colors.performance.neutral;
  if (changePercent > -5) return colors.performance.bear;
  return colors.performance.strongBear;
};

export const getHeatmapColor = (intensity, theme = defaultTheme) => {
  const { colors } = theme;
  if (intensity < 0.25) return colors.heatmap.low;
  if (intensity < 0.5) return colors.heatmap.medium;
  if (intensity < 0.75) return colors.heatmap.high;
  return colors.heatmap.extreme;
};

// Generate CSS custom properties for theme
export const generateThemeCSS = (theme) => {
  const { colors } = theme;
  return `
    :root {
      --color-primary: ${colors.primary};
      --color-secondary: ${colors.secondary};
      --color-success: ${colors.success};
      --color-error: ${colors.error};
      --color-warning: ${colors.warning};
      --color-background: ${colors.background};
      --color-surface: ${colors.surface};
      --color-text-primary: ${colors.text.primary};
      --color-text-secondary: ${colors.text.secondary};
      --color-text-disabled: ${colors.text.disabled};
      
      --heatmap-low: ${colors.heatmap.low};
      --heatmap-medium: ${colors.heatmap.medium};
      --heatmap-high: ${colors.heatmap.high};
      --heatmap-extreme: ${colors.heatmap.extreme};
      
      --volatility-very-low: ${colors.volatility.veryLow};
      --volatility-low: ${colors.volatility.low};
      --volatility-medium: ${colors.volatility.medium};
      --volatility-high: ${colors.volatility.high};
      --volatility-very-high: ${colors.volatility.veryHigh};
      --volatility-extreme: ${colors.volatility.extreme};
      
      --performance-strong-bull: ${colors.performance.strongBull};
      --performance-bull: ${colors.performance.bull};
      --performance-neutral: ${colors.performance.neutral};
      --performance-bear: ${colors.performance.bear};
      --performance-strong-bear: ${colors.performance.strongBear};
    }
  `;
};

// Apply theme to document
export const applyTheme = (themeId) => {
  const theme = getTheme(themeId);
  const styleElement = document.getElementById("calendar-theme-styles");

  if (styleElement) {
    styleElement.textContent = generateThemeCSS(theme);
  } else {
    const newStyleElement = document.createElement("style");
    newStyleElement.id = "calendar-theme-styles";
    newStyleElement.textContent = generateThemeCSS(theme);
    document.head.appendChild(newStyleElement);
  }

  // Store theme preference
  localStorage.setItem("calendar-theme", themeId);

  return theme;
};

// Get saved theme preference
export const getSavedTheme = () => {
  return localStorage.getItem("calendar-theme") || "default";
};

// Theme context for React
export const createThemeContext = (initialTheme = "default") => {
  return {
    currentTheme: getTheme(initialTheme),
    themeId: initialTheme,
    availableThemes: getThemeNames(),
    setTheme: applyTheme,
    getVolatilityColor: (volatility) =>
      getVolatilityColor(volatility, getTheme(initialTheme)),
    getPerformanceColor: (changePercent) =>
      getPerformanceColor(changePercent, getTheme(initialTheme)),
    getHeatmapColor: (intensity) =>
      getHeatmapColor(intensity, getTheme(initialTheme)),
  };
};
