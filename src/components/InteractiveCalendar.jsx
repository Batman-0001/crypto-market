import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Fade,
  Backdrop,
} from "@mui/material";
import {
  generateCalendarDays,
  generateCalendarWeeks,
  generateCalendarMonths,
  navigateToPrevious,
  navigateToNext,
  getCalendarCellKey,
  isInCurrentMonth,
} from "../utils/dateUtils";
import { useCryptoData } from "../hooks/useCryptoData";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import {
  useDateRangeSelection,
  useTooltip,
  useZoom,
  useFilters,
  useKeyboardShortcuts,
} from "../hooks/useInteractiveFeatures";
import CalendarHeader from "./CalendarHeader";
import CalendarCell from "./CalendarCell";
import CalendarLegend from "./CalendarLegend";
import CalendarControls from "./CalendarControls";
import CalendarTooltip from "./CalendarTooltip";
import DateDetailPanel from "./DateDetailPanel";
import DataDashboard from "./DataDashboard";
import { VIEW_TYPES, DEFAULT_SYMBOL, WEEK_DAYS } from "../constants";

/**
 * Interactive Calendar component with cryptocurrency market data visualization
 * Enhanced with advanced interactive features
 * @param {Object} props - Component props
 * @returns {React.Component} InteractiveCalendar component
 */
const InteractiveCalendar = ({
  initialSymbol = DEFAULT_SYMBOL,
  initialViewType = VIEW_TYPES.DAILY,
  initialDate = new Date(),
  onDateSelect = () => {},
  onDataUpdate = () => {},
  onDateRangeSelect = () => {},
  showLegend = true,
  showTooltips = true,
  showControls = true,
  enableKeyboardNav = true,
  enableSelection = true,
  enableZoom = true,
  showVolatilityHeatmap = true,
  showLiquidityIndicators = true,
  showPerformanceMetrics = true,
  availableSymbols = [
    "BTCUSDT",
    "ETHUSDT",
    "ADAUSDT",
    "DOTUSDT",
    "BNBUSDT",
    "SOLUSDT",
  ],
}) => {
  // State management
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [viewType, setViewType] = useState(initialViewType);
  const [selectedSymbol, setSelectedSymbol] = useState(initialSymbol);
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [detailPanelData, setDetailPanelData] = useState(null);
  const [controlsCollapsed, setControlsCollapsed] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  // Debug dashboard state
  useEffect(() => {
    console.log("Dashboard state changed:", { dashboardOpen, dashboardData });
  }, [dashboardOpen, dashboardData]);

  // Hooks
  const {
    data,
    loading,
    error,
    lastUpdated,
    dataRanges,
    refreshData,
    getDataForDate,
    getAggregatedData,
    isLoading,
  } = useCryptoData(selectedSymbol, viewType);

  // Interactive features hooks
  const dateRangeSelection = useDateRangeSelection((range) => {
    onDateRangeSelect(range);
    console.log("Date range selected:", range);
  });

  const tooltip = useTooltip();

  const zoom = useZoom(1, 0.5, 2);

  const filters = useFilters({
    symbols: [selectedSymbol],
    volatilityRange: [0, 20],
    volumeRange: [0, 100],
    showVolatilityHeatmap,
    showLiquidityIndicators,
    showPerformanceMetrics,
  });

  // Apply filters to data
  const filteredData = React.useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    return data.filter((item) => {
      // Volatility filter
      const volatilityRange = filters.filters.volatilityRange;
      if (volatilityRange && Array.isArray(volatilityRange)) {
        const [minVol, maxVol] = volatilityRange;
        if (item.volatility < minVol || item.volatility > maxVol) {
          return false;
        }
      }

      // Volume percentile filter
      const volumeRange = filters.filters.volumeRange;
      if (
        volumeRange &&
        Array.isArray(volumeRange) &&
        item.volumePercentile !== undefined
      ) {
        const [minVolPercentile, maxVolPercentile] = volumeRange;
        if (
          item.volumePercentile < minVolPercentile ||
          item.volumePercentile > maxVolPercentile
        ) {
          return false;
        }
      }

      return true;
    });
  }, [data, filters.filters.volatilityRange, filters.filters.volumeRange]);

  // Debug filtered data
  useEffect(() => {
    console.log("Filtered data count:", filteredData ? filteredData.length : 0);
    if (filteredData && filteredData.length > 0) {
      console.log("Sample filtered data:", filteredData.slice(0, 3));
    }
  }, [filteredData]);

  // Create filtered data lookup map
  const createFilteredDataLookup = useCallback(() => {
    const lookup = new Map();
    filteredData.forEach((item) => {
      const key = getCalendarCellKey(new Date(item.date), viewType);
      lookup.set(key, item);
    });
    return lookup;
  }, [filteredData, viewType]);

  // Create the filtered data lookup map
  const filteredDataLookup = React.useMemo(() => {
    return createFilteredDataLookup();
  }, [createFilteredDataLookup]);

  // Enhanced getDataForDate that respects filters
  const getFilteredDataForDate = useCallback(
    (date) => {
      const key = getCalendarCellKey(date, viewType);
      return filteredDataLookup.get(key) || null;
    },
    [filteredDataLookup, viewType]
  );

  const {
    focusedDate,
    isNavigating,
    containerRef,
    handleMouseFocus,
    focusDate,
    focusToday,
    isDateFocused,
  } = useKeyboardNavigation({
    enabled: enableKeyboardNav,
    initialFocusDate: currentDate,
    onNavigate: (date, key) => {
      // Handle month/year navigation when date moves out of current view
      if (!isInCurrentMonth(date, currentDate)) {
        setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1));
      }
    },
    onSelect: (date) => {
      setSelectedDate(date);
      onDateSelect(date, getFilteredDataForDate(date));
    },
    onEscape: () => {
      setSelectedDate(null);
    },
  });

  // Keyboard shortcuts
  useKeyboardShortcuts({
    escape: () => {
      dateRangeSelection.cancelSelection();
      setDetailPanelOpen(false);
      setDashboardOpen(false);
      setSelectedDate(null);
    },
    "ctrl+z": () => zoom.resetZoom(),
    "ctrl+plus": () => zoom.zoomIn(),
    "ctrl+minus": () => zoom.zoomOut(),
    "ctrl+r": () => refreshData(),
    "ctrl+h": () => setControlsCollapsed(!controlsCollapsed),
    f: () => {
      if (selectedDate && data) {
        setDetailPanelOpen(true);
        setDetailPanelData(getFilteredDataForDate(selectedDate));
      }
    },
    d: () => {
      if (selectedDate && data) {
        const cellData = getFilteredDataForDate(selectedDate);
        if (cellData) {
          setDashboardData(cellData);
          setDashboardOpen(true);
        }
      }
    },
  });

  // Generate calendar data based on view type
  const generateCalendarData = useCallback(() => {
    switch (viewType) {
      case VIEW_TYPES.WEEKLY:
        return generateCalendarWeeks(currentDate);
      case VIEW_TYPES.MONTHLY:
        return generateCalendarMonths(currentDate);
      case VIEW_TYPES.DAILY:
      default:
        return generateCalendarDays(currentDate);
    }
  }, [currentDate, viewType]);

  // Create data lookup map for performance
  const createDataLookup = useCallback(() => {
    const lookup = new Map();
    data.forEach((item) => {
      const key = getCalendarCellKey(new Date(item.date), viewType);
      lookup.set(key, item);
    });
    return lookup;
  }, [data, viewType]);

  // Handle date navigation
  const handleDateChange = useCallback(
    (direction) => {
      const newDate =
        direction === "next"
          ? navigateToNext(currentDate, viewType)
          : navigateToPrevious(currentDate, viewType);

      setCurrentDate(newDate);

      // Update focused date to stay in sync
      if (isNavigating) {
        focusDate(newDate);
      }
    },
    [currentDate, viewType, isNavigating, focusDate]
  );

  // Handle today navigation
  const handleToday = useCallback(() => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    focusToday();
  }, [focusToday]);

  // Handle cell click
  const handleCellClick = useCallback(
    (date, cellData) => {
      console.log("Cell clicked:", { date, cellData });
      setSelectedDate(date);
      handleMouseFocus(date);
      onDateSelect(date, cellData);
    },
    [handleMouseFocus, onDateSelect]
  );

  // Handle cell hover
  const handleCellHover = useCallback((date, cellData) => {
    setHoveredDate(date);
  }, []);

  // Handle cell leave
  const handleCellLeave = useCallback(() => {
    setHoveredDate(null);
  }, []);

  // Enhanced interactive event handlers
  const handleEnhancedCellClick = useCallback(
    (date, cellData, event) => {
      if (!enableSelection) return;

      if (event.ctrlKey || event.metaKey) {
        // Multi-selection mode
        if (selectedDate && selectedDate.getTime() === date.getTime()) {
          setSelectedDate(null);
        } else {
          setSelectedDate(date);
        }
      } else if (event.shiftKey && selectedDate) {
        // Range selection with shift
        dateRangeSelection.startSelection(selectedDate);
        dateRangeSelection.updateSelection(date);
        dateRangeSelection.completeSelection();
      } else if (dateRangeSelection.selectionMode) {
        // Complete date range selection
        dateRangeSelection.updateSelection(date);
        dateRangeSelection.completeSelection();
      } else {
        // Normal single selection
        setSelectedDate(date);
        handleMouseFocus(date);
        onDateSelect(date, cellData);
      }
    },
    [
      enableSelection,
      selectedDate,
      dateRangeSelection,
      handleMouseFocus,
      onDateSelect,
    ]
  );

  const handleCellDoubleClick = useCallback((date, cellData, event) => {
    console.log("Double click detected!", { date, cellData });
    // Open Data Dashboard on double click
    if (cellData) {
      console.log("Opening dashboard via double click");
      setDashboardData(cellData);
      setDashboardOpen(true);
    } else {
      console.log("No cell data for double click");
    }
  }, []);

  const handleCellRightClick = useCallback(
    (date, cellData, event) => {
      event.preventDefault();
      // Start range selection on right click
      if (enableSelection) {
        dateRangeSelection.startSelection(date);
      }
    },
    [enableSelection, dateRangeSelection]
  );

  const handleCellMouseEnter = useCallback(
    (date, cellData, event) => {
      setHoveredDate(date);

      // Handle range selection hover
      if (dateRangeSelection.selectionMode) {
        dateRangeSelection.handleHover(date);
      }

      // Show tooltip
      if (showTooltips && cellData && event) {
        tooltip.showTooltip(
          {
            date,
            cellData,
            symbol: selectedSymbol,
          },
          event
        );
      }
    },
    [dateRangeSelection, showTooltips, tooltip, selectedSymbol]
  );

  const handleCellMouseLeave = useCallback(
    (date, event) => {
      setHoveredDate(null);
      tooltip.hideTooltip();
    },
    [tooltip]
  );

  // Control handlers
  const handleSymbolChange = useCallback(
    (newSymbol) => {
      setSelectedSymbol(newSymbol);
      setSelectedDate(null);
      dateRangeSelection.cancelSelection();
    },
    [dateRangeSelection]
  );

  const handleViewTypeChange = useCallback(
    (newViewType) => {
      setViewType(newViewType);
      setSelectedDate(null);
      dateRangeSelection.cancelSelection();
    },
    [dateRangeSelection]
  );

  const handleZoomChange = useCallback(
    (newZoom) => {
      zoom.setZoom(newZoom);
    },
    [zoom]
  );

  const handleFilterChange = useCallback(
    (filterKey, value) => {
      filters.updateFilter(filterKey, value);
    },
    [filters]
  );

  const handleDateRangeClear = useCallback(() => {
    dateRangeSelection.cancelSelection();
  }, [dateRangeSelection]);

  const handleRefreshData = useCallback(() => {
    refreshData();
    setSelectedDate(null);
    dateRangeSelection.cancelSelection();
  }, [refreshData, dateRangeSelection]);

  const handleDetailPanelClose = useCallback(() => {
    setDetailPanelOpen(false);
    setDetailPanelData(null);
  }, []);

  // Notify parent of data updates
  useEffect(() => {
    if (data && data.length > 0) {
      onDataUpdate(data, dataRanges);
    }
  }, [data, dataRanges, onDataUpdate]);

  // Generate calendar cells
  const calendarDates = generateCalendarData();
  const dataLookup = createDataLookup();

  // Render week day headers for daily view
  const renderWeekDayHeaders = () => {
    if (viewType !== VIEW_TYPES.DAILY) return null;

    return (
      <Grid container sx={{ mb: 1 }}>
        {WEEK_DAYS.map((day) => (
          <Grid item xs key={day}>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                textAlign: "center",
                fontWeight: "bold",
                color: "text.secondary",
                py: 1,
              }}
            >
              {day.substring(0, 3)}
            </Typography>
          </Grid>
        ))}
      </Grid>
    );
  };

  // Render calendar grid
  const renderCalendarGrid = () => {
    const cellsPerRow =
      viewType === VIEW_TYPES.DAILY
        ? 7
        : viewType === VIEW_TYPES.WEEKLY
        ? 4
        : 3;

    return (
      <Grid container spacing={0.5}>
        {calendarDates.map((date, index) => {
          const cellKey = getCalendarCellKey(date, viewType);
          const cellData = filteredDataLookup.get(cellKey);
          const isSelected =
            selectedDate && date.getTime() === selectedDate.getTime();
          const isFocused = isDateFocused(date);

          return (
            <Grid item xs={12 / cellsPerRow} key={`${cellKey}-${index}`}>
              <CalendarCell
                date={date}
                cellData={cellData}
                dataRanges={dataRanges}
                currentMonth={currentDate}
                viewType={viewType}
                isSelected={isSelected}
                isFocused={isFocused}
                isInSelection={dateRangeSelection.isDateInSelection(date)}
                isSelectionBoundary={dateRangeSelection.isSelectionBoundary(
                  date
                )}
                isHovered={
                  hoveredDate && hoveredDate.getTime() === date.getTime()
                }
                zoomLevel={zoom.zoomLevel}
                onClick={handleEnhancedCellClick}
                onDoubleClick={handleCellDoubleClick}
                onRightClick={handleCellRightClick}
                onMouseEnter={handleCellMouseEnter}
                onMouseLeave={handleCellMouseLeave}
                showTooltip={showTooltips}
                showVolatilityHeatmap={filters.filters.showVolatilityHeatmap}
                showLiquidityIndicators={
                  filters.filters.showLiquidityIndicators
                }
                showPerformanceMetrics={filters.filters.showPerformanceMetrics}
                interactive={true}
                selectionMode={dateRangeSelection.selectionMode}
              />
            </Grid>
          );
        })}
      </Grid>
    );
  };

  // Render loading state
  if (isLoading && (!data || data.length === 0)) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <CircularProgress />
        <Typography variant="body2" sx={{ ml: 2 }}>
          Loading market data...
        </Typography>
      </Box>
    );
  }

  // Render error state
  if (error && (!data || data.length === 0)) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100%",
        outline: "none",
        position: "relative",
        ...zoom.getZoomTransform(),
      }}
      tabIndex={-1}
    >
      {/* Advanced Controls */}
      {showControls && (
        <CalendarControls
          selectedSymbol={selectedSymbol}
          availableSymbols={availableSymbols}
          onSymbolChange={handleSymbolChange}
          viewType={viewType}
          onViewTypeChange={handleViewTypeChange}
          selectedDateRange={dateRangeSelection.getCurrentRange()}
          onDateRangeChange={dateRangeSelection.startSelection}
          onClearDateRange={handleDateRangeClear}
          showVolatilityHeatmap={filters.filters.showVolatilityHeatmap}
          onToggleVolatilityHeatmap={(value) =>
            handleFilterChange("showVolatilityHeatmap", value)
          }
          showLiquidityIndicators={filters.filters.showLiquidityIndicators}
          onToggleLiquidityIndicators={(value) =>
            handleFilterChange("showLiquidityIndicators", value)
          }
          showPerformanceMetrics={filters.filters.showPerformanceMetrics}
          onTogglePerformanceMetrics={(value) =>
            handleFilterChange("showPerformanceMetrics", value)
          }
          zoomLevel={zoom.zoomLevel}
          onZoomChange={handleZoomChange}
          onZoomIn={zoom.zoomIn}
          onZoomOut={zoom.zoomOut}
          onRefreshData={handleRefreshData}
          isLoading={isLoading}
          selectedDate={selectedDate}
          onOpenDashboard={() => {
            console.log("onOpenDashboard called!", { selectedDate });
            if (selectedDate) {
              const cellData = getFilteredDataForDate(selectedDate);
              console.log("cellData found:", cellData);
              if (cellData) {
                setDashboardData(cellData);
                setDashboardOpen(true);
                console.log("Dashboard should be opening...");
              } else {
                console.log("No cellData found for selected date");
              }
            } else {
              console.log("No selected date");
            }
          }}
          volatilityThreshold={filters.filters.volatilityRange}
          onVolatilityThresholdChange={(value) =>
            handleFilterChange("volatilityRange", value)
          }
          volumeThreshold={filters.filters.volumeRange}
          onVolumeThresholdChange={(value) =>
            handleFilterChange("volumeRange", value)
          }
          isCollapsed={controlsCollapsed}
          onToggleCollapse={(value) => setControlsCollapsed(value)}
        />
      )}

      {/* Legend */}
      {showLegend && (
        <CalendarLegend
          showVolatilityHeatmap={filters.filters.showVolatilityHeatmap}
          showLiquidityIndicators={filters.filters.showLiquidityIndicators}
          showPerformanceMetrics={filters.filters.showPerformanceMetrics}
          dataRanges={dataRanges}
        />
      )}

      {/* Header */}
      <CalendarHeader
        currentDate={currentDate}
        viewType={viewType}
        selectedSymbol={selectedSymbol}
        onDateChange={handleDateChange}
        onViewTypeChange={handleViewTypeChange}
        onSymbolChange={handleSymbolChange}
        onRefresh={refreshData}
        onToday={handleToday}
        isLoading={isLoading}
        lastUpdated={lastUpdated}
        dataRanges={dataRanges}
        enableKeyboardNavigation={enableKeyboardNav}
      />

      {/* Calendar Body */}
      <Paper elevation={0} sx={{ p: 2 }}>
        <Fade in={!isLoading}>
          <Box>
            {renderWeekDayHeaders()}
            {renderCalendarGrid()}
          </Box>
        </Fade>

        {/* Loading overlay */}
        {isLoading && data && data.length > 0 && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <CircularProgress size={24} />
          </Box>
        )}
      </Paper>

      {/* Error notification */}
      {error && data && data.length > 0 && (
        <Alert severity="warning" sx={{ m: 2 }}>
          {error} (Showing cached data)
        </Alert>
      )}

      {/* Enhanced Tooltip */}
      {tooltip.tooltipOpen && tooltip.tooltipData && (
        <Box
          sx={{
            position: "fixed",
            left: tooltip.tooltipPosition.x,
            top: tooltip.tooltipPosition.y,
            zIndex: 10000,
            pointerEvents: "none",
            transform: "translate(-50%, -100%)",
          }}
        >
          <CalendarTooltip
            date={tooltip.tooltipData.date}
            cellData={tooltip.tooltipData.cellData}
            symbol={tooltip.tooltipData.symbol}
            isOpen={tooltip.tooltipOpen}
            onClose={tooltip.hideTooltip}
          />
        </Box>
      )}

      {/* Date Detail Panel */}
      {detailPanelOpen && (
        <>
          <Backdrop
            open={detailPanelOpen}
            onClick={handleDetailPanelClose}
            sx={{ zIndex: 9999 }}
          />
          <DateDetailPanel
            date={selectedDate}
            cellData={detailPanelData}
            symbol={selectedSymbol}
            isOpen={detailPanelOpen}
            onClose={handleDetailPanelClose}
            historicalData={data || []}
          />
        </>
      )}

      {/* Data Dashboard */}
      <DataDashboard
        open={dashboardOpen}
        onClose={() => {
          console.log("Dashboard closing...");
          setDashboardOpen(false);
        }}
        selectedData={dashboardData}
        historicalData={data || []}
        benchmarkData={[]} // TODO: Add benchmark data if available
        technicalIndicators={{}}
      />
    </Box>
  );
};

export default InteractiveCalendar;
