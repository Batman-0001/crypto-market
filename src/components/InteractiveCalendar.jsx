import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Fade,
  Backdrop,
  useTheme,
  alpha,
} from "@mui/material";
import { gsap } from "gsap";
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
import DataDashboardPanel from "./DataDashboardPanel";
import { useDashboardPanel } from "../hooks/useDashboardPanel";
import { VIEW_TYPES, DEFAULT_SYMBOL } from "../constants";

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
  const theme = useTheme();

  // Animation refs
  const calendarRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const cellRefs = useRef([]);

  // State management
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [viewType, setViewType] = useState(initialViewType);
  const [selectedSymbol, setSelectedSymbol] = useState(initialSymbol);
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [detailPanelData, setDetailPanelData] = useState(null);
  const [controlsCollapsed, setControlsCollapsed] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  // Dashboard Panel Hook - unified dashboard management
  const {
    isOpen: isDashboardOpen,
    selectedDate: dashboardSelectedDate,
    selectedDateRange: dashboardSelectedDateRange,
    activeSymbol: dashboardActiveSymbol,
    marketData: dashboardMarketData,
    isLoading: isDashboardLoading,
    openDashboard,
    openDashboardWithRange,
    closeDashboard,
    setActiveSymbol: setDashboardSymbol,
  } = useDashboardPanel();

  // GSAP Animation Functions
  const animateCalendarEntry = useCallback(() => {
    if (!animationsEnabled || !calendarRef.current) return;

    gsap.fromTo(
      calendarRef.current,
      {
        opacity: 0,
        y: 30,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
      }
    );
  }, [animationsEnabled]);

  const animateHeaderChange = useCallback(() => {
    if (!animationsEnabled || !headerRef.current) return;

    gsap.fromTo(
      headerRef.current,
      { x: -20, opacity: 0.7 },
      { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
    );
  }, [animationsEnabled]);

  const animateGridTransition = useCallback(() => {
    if (!animationsEnabled || !gridRef.current) return;

    gsap.fromTo(
      gridRef.current.children,
      {
        opacity: 0,
        scale: 0.8,
        rotationY: 15,
      },
      {
        opacity: 1,
        scale: 1,
        rotationY: 0,
        duration: 0.6,
        stagger: 0.02,
        ease: "back.out(1.7)",
      }
    );
  }, [animationsEnabled]);

  const animateCellHover = useCallback(
    (element, isHover = true) => {
      if (!animationsEnabled || !element) return;

      if (isHover) {
        gsap.to(element, {
          scale: 1.05,
          rotationY: 5,
          z: 10,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.to(element, {
          scale: 1,
          rotationY: 0,
          z: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    },
    [animationsEnabled]
  );

  const animateCellClick = useCallback(
    (element) => {
      if (!animationsEnabled || !element) return;

      gsap.to(element, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });
    },
    [animationsEnabled]
  );

  // Initialize animations
  useEffect(() => {
    animateCalendarEntry();
  }, [animateCalendarEntry]);

  // Animate on date/view changes
  useEffect(() => {
    animateHeaderChange();
    setTimeout(() => animateGridTransition(), 100);
  }, [currentDate, viewType, animateHeaderChange, animateGridTransition]);

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

    // Open dashboard with date range if Ctrl+D is held
    if (range && range.start && range.end) {
      // You can add a modifier key check here if needed
      // For now, we'll just console log for potential future enhancement
      console.log("Range available for dashboard:", range);
    }
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
      closeDashboard();
      setSelectedDate(null);
    },
    "ctrl+z": () => zoom.resetZoom(),
    "ctrl+plus": () => zoom.zoomIn(),
    "ctrl+minus": () => zoom.zoomOut(),
    "ctrl+r": () => refreshData(),
    "ctrl+h": () => setControlsCollapsed(!controlsCollapsed),
    "ctrl+d": () => {
      if (selectedDate) {
        openDashboard(selectedDate, selectedSymbol);
      }
    },
    "ctrl+shift+d": () => {
      if (
        dateRangeSelection.selectedRange &&
        dateRangeSelection.selectedRange.start &&
        dateRangeSelection.selectedRange.end
      ) {
        openDashboardWithRange(
          dateRangeSelection.selectedRange.start,
          dateRangeSelection.selectedRange.end,
          selectedSymbol
        );
      }
    },
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
          // Open unified dashboard with the selected date data
          openDashboard(selectedDate, selectedSymbol);
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
    (date, cellData, event) => {
      console.log("Cell clicked:", { date, cellData });

      // Animate click
      if (event?.currentTarget) {
        animateCellClick(event.currentTarget);
      }

      setSelectedDate(date);
      handleMouseFocus(date);
      onDateSelect(date, cellData);

      // Check for double-click to open dashboard
      if (event?.detail === 2) {
        openDashboard(date, selectedSymbol);
      }
    },
    [
      handleMouseFocus,
      onDateSelect,
      animateCellClick,
      openDashboard,
      selectedSymbol,
    ]
  );

  // Handle cell hover
  const handleCellHover = useCallback(
    (date, cellData, event, isEntering = true) => {
      if (isEntering) {
        setHoveredDate(date);
        if (event?.currentTarget) {
          animateCellHover(event.currentTarget, true);
        }
      } else {
        setHoveredDate(null);
        if (event?.currentTarget) {
          animateCellHover(event.currentTarget, false);
        }
      }
    },
    [animateCellHover]
  );

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

  const handleCellDoubleClick = useCallback(
    (date, cellData, event) => {
      console.log("Double click detected!", { date, cellData });
      // Open Data Dashboard on double click
      if (cellData) {
        console.log("Opening dashboard via double click");
        openDashboard(date, selectedSymbol);
      } else {
        console.log("No cell data for double click");
      }
    },
    [openDashboard, selectedSymbol]
  );

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
      setDashboardSymbol(newSymbol);
      setSelectedDate(null);
      dateRangeSelection.cancelSelection();
    },
    [dateRangeSelection, setDashboardSymbol]
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

  // Render modern calendar grid with GSAP animations
  const renderModernCalendarGrid = () => {
    const cellsPerRow =
      viewType === VIEW_TYPES.DAILY
        ? 7
        : viewType === VIEW_TYPES.WEEKLY
        ? 4
        : 3;

    return (
      <Grid
        container
        spacing={1.5}
        sx={{
          "& .MuiGrid-item": {
            transition: "all 0.3s ease",
          },
        }}
      >
        {calendarDates.map((date, index) => {
          const cellKey = getCalendarCellKey(date, viewType);
          const cellData = filteredDataLookup.get(cellKey);
          const isSelected =
            selectedDate && date.getTime() === selectedDate.getTime();
          const isFocused = isDateFocused(date);
          const isToday = new Date().toDateString() === date.toDateString();

          return (
            <Grid
              item
              xs={12 / cellsPerRow}
              key={`${cellKey}-${index}`}
              ref={(el) => (cellRefs.current[index] = el)}
            >
              <Box
                sx={{
                  position: "relative",
                  borderRadius: "16px",
                  overflow: "hidden",
                  transformOrigin: "center",
                  transformStyle: "preserve-3d",
                  cursor: "pointer",
                  background: isSelected
                    ? `linear-gradient(135deg, 
                      ${alpha(theme.palette.primary.main, 0.15)} 0%, 
                      ${alpha(theme.palette.primary.main, 0.08)} 100%)`
                    : isToday
                    ? `linear-gradient(135deg, 
                      ${alpha(theme.palette.secondary.main, 0.12)} 0%, 
                      ${alpha(theme.palette.secondary.main, 0.06)} 100%)`
                    : `linear-gradient(135deg, 
                      ${alpha(theme.palette.background.paper, 0.8)} 0%, 
                      ${alpha(theme.palette.background.paper, 0.4)} 100%)`,
                  backdropFilter: "blur(10px)",
                  border: isSelected
                    ? `2px solid ${theme.palette.primary.main}`
                    : isToday
                    ? `2px solid ${theme.palette.secondary.main}`
                    : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  boxShadow: isSelected
                    ? `0 8px 32px ${alpha(theme.palette.primary.main, 0.25)},
                     inset 0 1px 0 ${alpha("#ffffff", 0.2)}`
                    : isToday
                    ? `0 6px 24px ${alpha(theme.palette.secondary.main, 0.2)},
                     inset 0 1px 0 ${alpha("#ffffff", 0.1)}`
                    : `0 2px 8px ${alpha("#000000", 0.04)},
                     inset 0 1px 0 ${alpha("#ffffff", 0.05)}`,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "translateY(-4px) scale(1.02)",
                    boxShadow: `0 16px 48px ${alpha("#000000", 0.12)},
                               inset 0 1px 0 ${alpha("#ffffff", 0.2)}`,
                    background: `linear-gradient(135deg, 
                      ${alpha(theme.palette.primary.main, 0.1)} 0%, 
                      ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                    border: `1px solid ${alpha(
                      theme.palette.primary.main,
                      0.3
                    )}`,
                  },
                  "&:active": {
                    transform: "translateY(-2px) scale(0.98)",
                  },
                }}
                onMouseEnter={(e) => handleCellHover(date, cellData, e, true)}
                onMouseLeave={(e) => handleCellHover(date, cellData, e, false)}
                onClick={(e) => handleCellClick(date, cellData, e)}
              >
                {/* Shimmer effect */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: "-100%",
                    width: "100%",
                    height: "100%",
                    background: `linear-gradient(90deg, 
                      transparent 0%, 
                      ${alpha("#ffffff", 0.4)} 50%, 
                      transparent 100%)`,
                    animation: "shimmer 3s infinite",
                    "@keyframes shimmer": {
                      "0%": { left: "-100%" },
                      "100%": { left: "100%" },
                    },
                  }}
                />

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
                  showPerformanceMetrics={
                    filters.filters.showPerformanceMetrics
                  }
                  interactive={true}
                  selectionMode={dateRangeSelection.selectionMode}
                  sx={{
                    background: "transparent",
                    border: "none",
                    boxShadow: "none",
                    borderRadius: 0,
                  }}
                />

                {/* Modern selection indicator */}
                {isSelected && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: theme.palette.primary.main,
                      boxShadow: `0 0 8px ${alpha(
                        theme.palette.primary.main,
                        0.6
                      )}`,
                      animation: "pulse 2s infinite",
                      "@keyframes pulse": {
                        "0%, 100%": { transform: "scale(1)", opacity: 1 },
                        "50%": { transform: "scale(1.2)", opacity: 0.8 },
                      },
                    }}
                  />
                )}

                {/* Today indicator */}
                {isToday && !isSelected && (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 4,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 20,
                      height: 2,
                      borderRadius: "1px",
                      background: `linear-gradient(90deg, 
                        ${theme.palette.secondary.main} 0%, 
                        ${alpha(theme.palette.secondary.main, 0.6)} 100%)`,
                      boxShadow: `0 0 4px ${alpha(
                        theme.palette.secondary.main,
                        0.4
                      )}`,
                    }}
                  />
                )}
              </Box>
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
                openDashboard(selectedDate, selectedSymbol);
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
      <Box ref={headerRef}>
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
      </Box>

      {/* Modern Calendar Body */}
      <Box
        ref={calendarRef}
        sx={{
          background: `linear-gradient(145deg, 
            ${alpha("#000000", 0.02)} 0%, 
            ${alpha("#ffffff", 0.08)} 50%, 
            ${alpha("#000000", 0.02)} 100%)`,
          borderRadius: "24px",
          padding: { xs: 2, sm: 3, md: 4 },
          position: "relative",
          overflow: "hidden",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: `
            0 1px 3px ${alpha("#000000", 0.08)},
            0 8px 32px ${alpha("#000000", 0.04)},
            inset 0 1px 0 ${alpha("#ffffff", 0.1)}
          `,
          backdropFilter: "blur(20px)",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: `linear-gradient(90deg, 
              transparent 0%, 
              ${alpha(theme.palette.primary.main, 0.2)} 20%, 
              ${alpha(theme.palette.primary.main, 0.4)} 50%, 
              ${alpha(theme.palette.primary.main, 0.2)} 80%, 
              transparent 100%)`,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 50% 0%, 
              ${alpha(theme.palette.primary.main, 0.03)} 0%, 
              transparent 70%)`,
            pointerEvents: "none",
          },
        }}
      >
        <Fade in={!isLoading}>
          <Box sx={{ position: "relative", zIndex: 2 }}>
            {/* Modern Calendar Grid */}
            <Box
              ref={gridRef}
              sx={{
                perspective: "1000px",
                transformStyle: "preserve-3d",
              }}
            >
              {renderModernCalendarGrid()}
            </Box>
          </Box>
        </Fade>

        {/* Modern Loading Overlay */}
        {isLoading && data && data.length > 0 && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(135deg, 
                ${alpha("#ffffff", 0.9)} 0%, 
                ${alpha("#ffffff", 0.7)} 100%)`,
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              borderRadius: "24px",
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <CircularProgress
                size={32}
                thickness={3}
                sx={{
                  color: theme.palette.primary.main,
                  mb: 2,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: alpha(theme.palette.text.primary, 0.8),
                  fontWeight: 500,
                }}
              >
                Updating data...
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

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

      {/* Enhanced Data Dashboard Panel - Unified Dashboard */}
      <DataDashboardPanel
        isOpen={isDashboardOpen}
        onClose={closeDashboard}
        selectedDate={dashboardSelectedDate}
        selectedDateRange={dashboardSelectedDateRange}
        marketData={dashboardMarketData}
        symbol={dashboardActiveSymbol}
        benchmarkData={{
          name: "S&P 500",
          correlation: 0.65,
          beta: 1.8,
          alpha: 12.4,
          sharpeRatio: 1.35,
        }}
      />
    </Box>
  );
};

export default InteractiveCalendar;
