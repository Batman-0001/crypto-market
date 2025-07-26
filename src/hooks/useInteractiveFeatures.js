import { useState, useCallback, useRef, useEffect } from "react";

/**
 * Custom hook for managing date range selection functionality
 * @param {Function} onRangeChange - Callback when range changes
 * @returns {Object} Selection state and handlers
 */
export const useDateRangeSelection = (onRangeChange = () => {}) => {
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);

  // Start selection
  const startSelection = useCallback((date) => {
    setSelectionMode(true);
    setSelectionStart(date);
    setSelectionEnd(null);
    setHoveredDate(null);
  }, []);

  // Update selection end
  const updateSelection = useCallback(
    (date) => {
      if (selectionMode && selectionStart) {
        setSelectionEnd(date);

        // Ensure start is before end
        const start = selectionStart < date ? selectionStart : date;
        const end = selectionStart < date ? date : selectionStart;

        onRangeChange({ start, end });
      }
    },
    [selectionMode, selectionStart, onRangeChange]
  );

  // Complete selection
  const completeSelection = useCallback(() => {
    setSelectionMode(false);
    setHoveredDate(null);
  }, []);

  // Cancel selection
  const cancelSelection = useCallback(() => {
    setSelectionMode(false);
    setSelectionStart(null);
    setSelectionEnd(null);
    setHoveredDate(null);
    onRangeChange(null);
  }, [onRangeChange]);

  // Handle hover during selection
  const handleHover = useCallback(
    (date) => {
      if (selectionMode && selectionStart) {
        setHoveredDate(date);
      }
    },
    [selectionMode, selectionStart]
  );

  // Get current selection range
  const getCurrentRange = useCallback(() => {
    if (!selectionStart) return null;

    const end = selectionEnd || hoveredDate;
    if (!end) return null;

    return {
      start: selectionStart < end ? selectionStart : end,
      end: selectionStart < end ? end : selectionStart,
    };
  }, [selectionStart, selectionEnd, hoveredDate]);

  // Check if date is in selection range
  const isDateInSelection = useCallback(
    (date) => {
      const range = getCurrentRange();
      if (!range) return false;

      return date >= range.start && date <= range.end;
    },
    [getCurrentRange]
  );

  // Check if date is selection boundary
  const isSelectionBoundary = useCallback(
    (date) => {
      const range = getCurrentRange();
      if (!range) return false;

      return (
        date.getTime() === range.start.getTime() ||
        date.getTime() === range.end.getTime()
      );
    },
    [getCurrentRange]
  );

  return {
    selectionMode,
    selectionStart,
    selectionEnd,
    hoveredDate,
    startSelection,
    updateSelection,
    completeSelection,
    cancelSelection,
    handleHover,
    getCurrentRange,
    isDateInSelection,
    isSelectionBoundary,
  };
};

/**
 * Custom hook for managing tooltip state and positioning
 * @returns {Object} Tooltip state and handlers
 */
export const useTooltip = () => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const tooltipTimeout = useRef(null);

  // Show tooltip with delay
  const showTooltip = useCallback((data, event) => {
    clearTimeout(tooltipTimeout.current);

    // Validate event and currentTarget before proceeding
    if (!event || !event.currentTarget) {
      console.warn("showTooltip: Invalid event or currentTarget");
      return;
    }

    tooltipTimeout.current = setTimeout(() => {
      // Double-check currentTarget still exists in timeout
      if (!event.currentTarget) {
        console.warn("showTooltip: currentTarget is null in timeout");
        return;
      }

      try {
        const rect = event.currentTarget.getBoundingClientRect();
        setTooltipPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 10,
        });
        setTooltipData(data);
        setTooltipOpen(true);
      } catch (error) {
        console.error("Error getting bounding rect:", error);
      }
    }, 300); // 300ms delay
  }, []);

  // Hide tooltip
  const hideTooltip = useCallback(() => {
    clearTimeout(tooltipTimeout.current);
    setTooltipOpen(false);
    setTooltipData(null);
  }, []);

  // Cleanup function to handle component unmounting
  useEffect(() => {
    return () => {
      clearTimeout(tooltipTimeout.current);
    };
  }, []);

  // Update tooltip position on scroll/resize
  useEffect(() => {
    const handleScroll = () => {
      if (tooltipOpen) {
        hideTooltip();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && tooltipOpen) {
        hideTooltip();
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearTimeout(tooltipTimeout.current);
    };
  }, [tooltipOpen, hideTooltip]);

  return {
    tooltipOpen,
    tooltipData,
    tooltipPosition,
    showTooltip,
    hideTooltip,
  };
};

/**
 * Custom hook for managing zoom functionality
 * @param {number} initialZoom - Initial zoom level
 * @param {number} minZoom - Minimum zoom level
 * @param {number} maxZoom - Maximum zoom level
 * @returns {Object} Zoom state and handlers
 */
export const useZoom = (initialZoom = 1, minZoom = 0.5, maxZoom = 2) => {
  const [zoomLevel, setZoomLevel] = useState(initialZoom);

  const zoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev + 0.25, maxZoom));
  }, [maxZoom]);

  const zoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(prev - 0.25, minZoom));
  }, [minZoom]);

  const setZoom = useCallback(
    (level) => {
      setZoomLevel(Math.max(minZoom, Math.min(maxZoom, level)));
    },
    [minZoom, maxZoom]
  );

  const resetZoom = useCallback(() => {
    setZoomLevel(initialZoom);
  }, [initialZoom]);

  // Get CSS transform for zoom
  const getZoomTransform = useCallback(
    () => ({
      transform: `scale(${zoomLevel})`,
      transformOrigin: "center center",
      transition: "transform 0.2s ease-in-out",
    }),
    [zoomLevel]
  );

  return {
    zoomLevel,
    zoomIn,
    zoomOut,
    setZoom,
    resetZoom,
    getZoomTransform,
    canZoomIn: zoomLevel < maxZoom,
    canZoomOut: zoomLevel > minZoom,
  };
};

/**
 * Custom hook for managing filter state
 * @param {Object} initialFilters - Initial filter values
 * @returns {Object} Filter state and handlers
 */
export const useFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState({
    symbols: ["BTCUSDT"],
    volatilityRange: [0, 10],
    volumeRange: [0, 100],
    showVolatilityHeatmap: true,
    showLiquidityIndicators: true,
    showPerformanceMetrics: true,
    ...initialFilters,
  });

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Filter data based on current filters
  const filterData = useCallback(
    (data) => {
      return data.filter((item) => {
        // Volatility filter
        if (
          item.volatility < filters.volatilityRange[0] ||
          item.volatility > filters.volatilityRange[1]
        ) {
          return false;
        }

        // Volume filter (assuming normalized volume 0-100)
        const volumePercentile = item.volumePercentile || 50;
        if (
          volumePercentile < filters.volumeRange[0] ||
          volumePercentile > filters.volumeRange[1]
        ) {
          return false;
        }

        return true;
      });
    },
    [filters]
  );

  return {
    filters,
    updateFilter,
    updateFilters,
    resetFilters,
    filterData,
  };
};

/**
 * Custom hook for managing keyboard shortcuts
 * @param {Object} shortcuts - Shortcut definitions
 * @returns {Object} Keyboard handler
 */
export const useKeyboardShortcuts = (shortcuts = {}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      const ctrl = event.ctrlKey || event.metaKey;
      const shift = event.shiftKey;
      const alt = event.altKey;

      // Build shortcut key
      let shortcutKey = "";
      if (ctrl) shortcutKey += "ctrl+";
      if (shift) shortcutKey += "shift+";
      if (alt) shortcutKey += "alt+";
      shortcutKey += key;

      // Execute shortcut if found
      if (shortcuts[shortcutKey]) {
        event.preventDefault();
        shortcuts[shortcutKey]();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);

  return { shortcuts };
};
