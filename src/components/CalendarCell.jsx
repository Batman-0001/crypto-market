import React, { useState, useCallback } from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import { format } from "date-fns";
import {
  getHeatmapCellStyle,
  getTrendArrow,
  generateLiquidityPattern,
  calculateIntensity,
} from "../utils/colorUtils";
import { isDateToday, isInCurrentMonth } from "../utils/dateUtils";

/**
 * Individual calendar cell component with market data visualization
 * Enhanced with interactive features
 * @param {Object} props - Component props
 * @returns {React.Component} CalendarCell component
 */
const CalendarCell = ({
  date,
  cellData,
  dataRanges,
  currentMonth,
  viewType = "daily",
  isSelected = false,
  isFocused = false,
  isInSelection = false,
  isSelectionBoundary = false,
  isHovered = false,
  zoomLevel = 1,
  onClick = () => {},
  onMouseEnter = () => {},
  onMouseLeave = () => {},
  onDoubleClick = () => {},
  onRightClick = () => {},
  showTooltip = true,
  showVolatilityHeatmap = true,
  showLiquidityIndicators = true,
  showPerformanceMetrics = true,
  interactive = true,
  selectionMode = false,
}) => {
  // Date calculations
  const isToday = isDateToday(date);
  const isCurrentMonthDate = isInCurrentMonth(date, currentMonth);
  const dayNumber = format(date, "d");

  // Data calculations
  const hasData = cellData && Object.keys(cellData).length > 0;
  const volatility = hasData ? cellData.volatility || 0 : 0;
  const performance = hasData ? cellData.performance || {} : {};
  const volume = hasData ? cellData.volume || 0 : 0;
  const priceChange = performance.priceChange || 0;

  // Style calculations
  const cellStyle =
    hasData && showVolatilityHeatmap
      ? getHeatmapCellStyle(cellData, dataRanges)
      : {};

  // Trend arrow for performance
  const trendArrow = getTrendArrow(priceChange);

  // Volume intensity for liquidity indicators
  const volumeIntensity =
    hasData && dataRanges.volumeRange
      ? calculateIntensity(
          volume,
          dataRanges.volumeRange.min,
          dataRanges.volumeRange.max
        )
      : 0;

  // Liquidity pattern
  const liquidityPattern = showLiquidityIndicators
    ? generateLiquidityPattern("dots", "#2196f3", volumeIntensity)
    : null;

  // Enhanced tooltip content with more details
  const getTooltipContent = useCallback(() => {
    if (!hasData) return format(date, "MMM dd, yyyy");

    return (
      <Box sx={{ maxWidth: 250 }}>
        <Typography
          variant="caption"
          display="block"
          sx={{ fontWeight: "bold", mb: 1 }}
        >
          {format(date, "EEEE, MMM dd, yyyy")}
        </Typography>

        {/* Price Information */}
        <Box sx={{ mb: 1 }}>
          <Typography variant="caption" display="block">
            💰 <strong>Price:</strong> ${cellData.close?.toFixed(2) || "N/A"}
          </Typography>
          <Typography
            variant="caption"
            display="block"
            sx={{
              color: priceChange >= 0 ? "success.main" : "error.main",
              fontWeight: "bold",
            }}
          >
            📈 <strong>Change:</strong> {priceChange > 0 ? "+" : ""}
            {priceChange.toFixed(2)}%
          </Typography>
        </Box>

        {/* Market Metrics */}
        <Box sx={{ mb: 1 }}>
          <Typography variant="caption" display="block">
            🌡️ <strong>Volatility:</strong> {volatility.toFixed(2)}%
          </Typography>
          <Typography variant="caption" display="block">
            📊 <strong>Volume:</strong> {volume.toLocaleString()}
          </Typography>
        </Box>

        {/* OHLC Data */}
        {cellData.open && (
          <Box
            sx={{ mt: 1, pt: 1, borderTop: "1px solid rgba(255,255,255,0.2)" }}
          >
            <Typography variant="caption" display="block">
              📊 <strong>OHLC:</strong> O: ${cellData.open.toFixed(2)} | H: $
              {cellData.high.toFixed(2)} | L: ${cellData.low.toFixed(2)} | C: $
              {cellData.close.toFixed(2)}
            </Typography>
          </Box>
        )}

        {/* Interactive hints */}
        <Box
          sx={{ mt: 1, pt: 1, borderTop: "1px solid rgba(255,255,255,0.2)" }}
        >
          <Typography
            variant="caption"
            display="block"
            sx={{ fontStyle: "italic", opacity: 0.8 }}
          >
            💡 Click for details • Double-click for analysis • Right-click for
            options
          </Typography>
        </Box>
      </Box>
    );
  }, [hasData, date, cellData, priceChange, volatility, volume]);

  // Handle mouse events with enhanced functionality
  const handleMouseEnter = useCallback(
    (event) => {
      if (interactive) {
        onMouseEnter(date, cellData, event);
      }
    },
    [interactive, date, cellData, onMouseEnter]
  );

  const handleMouseLeave = useCallback(
    (event) => {
      if (interactive) {
        onMouseLeave(date, event);
      }
    },
    [interactive, date, onMouseLeave]
  );

  const handleClick = useCallback(
    (event) => {
      if (interactive) {
        event.preventDefault();
        onClick(date, cellData, event);
      }
    },
    [interactive, date, cellData, onClick]
  );

  const handleDoubleClick = useCallback(
    (event) => {
      if (interactive) {
        event.preventDefault();
        onDoubleClick(date, cellData, event);
      }
    },
    [interactive, date, cellData, onDoubleClick]
  );

  const handleContextMenu = useCallback(
    (event) => {
      if (interactive) {
        event.preventDefault();
        onRightClick(date, cellData, event);
      }
    },
    [interactive, date, cellData, onRightClick]
  );

  // Dynamic styling based on interaction state
  const getInteractiveStyles = () => {
    let styles = {
      transition: "all 0.2s ease-in-out",
      transform: `scale(${zoomLevel})`,
      transformOrigin: "center center",
    };

    // Selection styling
    if (isInSelection) {
      styles.outline = "2px solid #2196f3";
      styles.outlineOffset = "-2px";
      styles.backgroundColor = isSelectionBoundary
        ? "rgba(33, 150, 243, 0.3)"
        : "rgba(33, 150, 243, 0.1)";
    }

    // Hover styling
    if (isHovered && interactive) {
      styles.transform = `scale(${zoomLevel * 1.05})`;
      styles.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
      styles.zIndex = 10;
    }

    // Focus styling
    if (isFocused) {
      styles.outline = "2px solid #ff9800";
      styles.outlineOffset = "-2px";
    }

    // Selection mode cursor
    if (selectionMode) {
      styles.cursor = "crosshair";
    }

    return styles;
  };

  // Tooltip content
  const tooltipTitle = showTooltip ? getTooltipContent() : "";

  // Cell container style with enhanced interactivity
  const containerStyle = {
    position: "relative",
    minHeight: Math.max(40, 60 * zoomLevel),
    minWidth: Math.max(40, 60 * zoomLevel),
    border: "1px solid #e0e0e0",
    backgroundColor: cellStyle.backgroundColor || "#ffffff",
    backgroundImage: liquidityPattern || cellStyle.backgroundImage,
    backgroundSize: cellStyle.backgroundSize || "8px 8px",
    borderLeft: showPerformanceMetrics
      ? `3px solid ${trendArrow.color}`
      : cellStyle.borderLeft,
    cursor: interactive ? "pointer" : "default",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "4px",
    opacity: isCurrentMonthDate ? 1 : 0.3,
    ...getInteractiveStyles(), // Add interactive styles
    // Today highlighting
    ...(isToday && {
      boxShadow: "inset 0 0 0 2px #ff9800",
      fontWeight: "bold",
    }),
    // Selected state
    ...(isSelected && {
      backgroundColor: "rgba(25, 118, 210, 0.1)",
      border: "2px solid #1976d2",
    }),
  };

  return (
    <Tooltip
      title={tooltipTitle}
      arrow
      placement="top"
      enterDelay={interactive ? 300 : 1000}
      leaveDelay={200}
      disabled={!showTooltip}
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: "rgba(0, 0, 0, 0.9)",
            "& .MuiTooltip-arrow": {
              color: "rgba(0, 0, 0, 0.9)",
            },
          },
        },
      }}
    >
      <Box
        sx={containerStyle}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role={interactive ? "button" : "cell"}
        tabIndex={interactive ? 0 : -1}
        aria-label={`${format(date, "MMMM dd, yyyy")}${
          hasData ? `, Price change: ${priceChange.toFixed(2)}%` : ""
        }`}
        data-date={format(date, "yyyy-MM-dd")}
        data-has-data={hasData}
        data-selectable={interactive}
      >
        {/* Date Number */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            minHeight: "16px",
            fontSize: Math.max(10, 12 * zoomLevel),
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: "inherit",
              fontWeight: isToday ? "bold" : "normal",
              color: isCurrentMonthDate ? "text.primary" : "text.disabled",
              lineHeight: 1,
            }}
          >
            {dayNumber}
          </Typography>

          {/* Performance Arrow */}
          {showPerformanceMetrics &&
            hasData &&
            Math.abs(priceChange) > 0.01 && (
              <Typography
                variant="caption"
                sx={{
                  color: trendArrow.color,
                  fontSize: Math.max(8, 10 * zoomLevel),
                  fontWeight: "bold",
                  lineHeight: 1,
                }}
              >
                {trendArrow.symbol}
              </Typography>
            )}
        </Box>

        {/* Data Indicators */}
        {hasData && (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: Math.max(20, 30 * zoomLevel),
              mt: 0.5,
            }}
          >
            {/* Price Change Indicator */}
            {Math.abs(priceChange) > 0.01 && (
              <Typography
                variant="caption"
                sx={{
                  fontSize: Math.max(8, 9 * zoomLevel),
                  color: priceChange >= 0 ? "success.main" : "error.main",
                  fontWeight: "bold",
                  lineHeight: 1,
                }}
              >
                {priceChange > 0 ? "+" : ""}
                {priceChange.toFixed(1)}%
              </Typography>
            )}

            {/* Volatility Indicator */}
            {showVolatilityHeatmap && volatility > 1 && (
              <Typography
                variant="caption"
                sx={{
                  fontSize: Math.max(6, 7 * zoomLevel),
                  color: "text.secondary",
                  lineHeight: 1,
                  mt: 0.25,
                }}
              >
                σ {volatility.toFixed(0)}%
              </Typography>
            )}
          </Box>
        )}

        {/* Volume Indicator Bar */}
        {showLiquidityIndicators && hasData && volumeIntensity > 0.1 && (
          <Box
            sx={{
              position: "absolute",
              bottom: 2,
              left: 2,
              right: 2,
              height: Math.max(2, 3 * zoomLevel),
              backgroundColor: "rgba(33, 150, 243, 0.3)",
              borderRadius: 1,
            }}
          >
            <Box
              sx={{
                height: "100%",
                width: `${volumeIntensity * 100}%`,
                backgroundColor: "#2196f3",
                borderRadius: 1,
                transition: "width 0.3s ease",
              }}
            />
          </Box>
        )}

        {/* Selection Indicator */}
        {isInSelection && (
          <Box
            sx={{
              position: "absolute",
              top: 1,
              right: 1,
              width: 6,
              height: 6,
              backgroundColor: "#2196f3",
              borderRadius: "50%",
              boxShadow: "0 0 0 1px white",
            }}
          />
        )}

        {/* Focus Indicator */}
        {isFocused && (
          <Box
            sx={{
              position: "absolute",
              top: -2,
              left: -2,
              right: -2,
              bottom: -2,
              border: "2px solid #ff9800",
              borderRadius: 1,
              pointerEvents: "none",
            }}
          />
        )}
      </Box>
    </Tooltip>
  );
};

export default CalendarCell;
