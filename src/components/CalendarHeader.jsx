import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Chip,
  Tooltip,
  Button,
  useTheme,
  useMediaQuery,
  alpha,
  Fade,
  Zoom,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Today,
  ViewDay,
  ViewWeek,
  CalendarViewMonth,
  Refresh,
  AccessTime,
  TrendingUp,
} from "@mui/icons-material";
import { formatDateForView } from "../utils/dateUtils";
import { VIEW_TYPES, CRYPTO_SYMBOLS } from "../constants";

/**
 * Calendar header component with navigation and controls
 * @param {Object} props - Component props
 * @returns {React.Component} CalendarHeader component
 */
const CalendarHeader = ({
  currentDate,
  viewType = VIEW_TYPES.DAILY,
  selectedSymbol = "BTCUSDT",
  onDateChange = () => {},
  onViewTypeChange = () => {},
  onSymbolChange = () => {},
  onRefresh = () => {},
  onToday = () => {},
  isLoading = false,
  lastUpdated = null,
  dataRanges = null,
  enableKeyboardNavigation = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Modern color palette - different from CalendarControls
  const colors = {
    background: {
      primary: `linear-gradient(145deg, 
        ${alpha("#1a1a2e", 0.05)} 0%, 
        ${alpha("#16213e", 0.08)} 50%, 
        ${alpha("#0f172a", 0.05)} 100%)`,
      surface: alpha("#ffffff", 0.02),
      glass: alpha("#ffffff", 0.08),
    },
    border: {
      primary: alpha("#e2e8f0", 0.15),
      accent: alpha("#6366f1", 0.2),
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
      accent: "#6366f1",
    },
    accent: {
      primary: "#6366f1",
      secondary: "#8b5cf6",
      success: "#10b981",
      warning: "#f59e0b",
    },
  };

  // Format the current date based on view type
  const formattedDate = formatDateForView(currentDate, viewType);

  // Get the display name for the selected symbol
  const selectedCrypto = CRYPTO_SYMBOLS.find(
    (crypto) => crypto.symbol === selectedSymbol
  );
  const cryptoDisplayName = selectedCrypto
    ? selectedCrypto.name
    : selectedSymbol;

  // View type icons
  const viewTypeIcons = {
    [VIEW_TYPES.DAILY]: ViewDay,
    [VIEW_TYPES.WEEKLY]: ViewWeek,
    [VIEW_TYPES.MONTHLY]: CalendarViewMonth,
  };

  return (
    <Box
      sx={{
        background: colors.background.primary,
        backdropFilter: "blur(20px)",
        border: `1px solid ${colors.border.primary}`,
        borderRadius: { xs: "20px", sm: "24px" },
        padding: { xs: 2, sm: 3, md: 4 },
        margin: { xs: 1, sm: 2 },
        position: "relative",
        overflow: "hidden",
        boxShadow: `
          0 1px 3px ${alpha("#000000", 0.05)},
          0 4px 12px ${alpha("#000000", 0.08)},
          inset 0 1px 0 ${alpha("#ffffff", 0.1)}
        `,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(90deg, 
            transparent 0%, 
            ${colors.accent.primary} 20%, 
            ${colors.accent.secondary} 50%, 
            ${colors.accent.primary} 80%, 
            transparent 100%)`,
          opacity: 0.6,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 50%, 
            ${alpha(colors.accent.primary, 0.03)} 0%, 
            transparent 50%)`,
          pointerEvents: "none",
        },
      }}
    >
      {/* Clean Two-Row Layout to Prevent Overlapping */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          width: "100%",
        }}
      >
        {/* Top Row - Date Navigation and Controls */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
            gap: 2,
          }}
        >
          {/* Left: Navigation Controls */}
          <Fade in timeout={600}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  background: colors.background.glass,
                  backdropFilter: "blur(10px)",
                  borderRadius: "16px",
                  border: `1px solid ${colors.border.primary}`,
                  padding: "4px",
                  boxShadow: `0 2px 8px ${alpha("#000000", 0.06)}`,
                }}
              >
                <Tooltip title="Previous period" arrow>
                  <IconButton
                    onClick={() => onDateChange("previous")}
                    disabled={isLoading}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      color: colors.text.secondary,
                      borderRadius: "12px",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        color: colors.accent.primary,
                        background: alpha(colors.accent.primary, 0.08),
                        transform: "translateX(-2px)",
                      },
                      "&:disabled": {
                        opacity: 0.4,
                      },
                    }}
                  >
                    <ChevronLeft />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Go to today" arrow>
                  <IconButton
                    onClick={onToday}
                    disabled={isLoading}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      color: colors.text.secondary,
                      borderRadius: "12px",
                      mx: 0.5,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        color: colors.accent.success,
                        background: alpha(colors.accent.success, 0.08),
                        transform: "scale(1.05)",
                      },
                      "&:disabled": {
                        opacity: 0.4,
                      },
                    }}
                  >
                    <Today />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Next period" arrow>
                  <IconButton
                    onClick={() => onDateChange("next")}
                    disabled={isLoading}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      color: colors.text.secondary,
                      borderRadius: "12px",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        color: colors.accent.primary,
                        background: alpha(colors.accent.primary, 0.08),
                        transform: "translateX(2px)",
                      },
                      "&:disabled": {
                        opacity: 0.4,
                      },
                    }}
                  >
                    <ChevronRight />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Fade>

          {/* Center: Date Display */}
          <Fade in timeout={700}>
            <Box
              onClick={onToday}
              sx={{
                cursor: "pointer",
                padding: { xs: "12px 20px", sm: "16px 28px" },
                background: `linear-gradient(135deg, 
                  ${alpha("#ffffff", 0.1)} 0%, 
                  ${alpha("#ffffff", 0.05)} 100%)`,
                backdropFilter: "blur(15px)",
                borderRadius: "16px",
                border: `1px solid ${colors.border.accent}`,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                overflow: "hidden",
                textAlign: "center",
                flex: "1",
                maxWidth: "320px",
                mx: 2,
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 8px 25px ${alpha(colors.accent.primary, 0.15)}`,
                  border: `1px solid ${alpha(colors.accent.primary, 0.3)}`,
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background: `linear-gradient(90deg, 
                    transparent 0%, 
                    ${alpha("#ffffff", 0.1)} 50%, 
                    transparent 100%)`,
                  transition: "left 0.6s ease",
                },
                "&:hover::before": {
                  left: "100%",
                },
              }}
            >
              <Typography
                variant={isMobile ? "h6" : "h5"}
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(135deg, 
                    ${colors.text.primary} 0%, 
                    ${colors.accent.primary} 100%)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: { xs: "-0.5px", sm: "-0.8px" },
                  fontSize: { xs: "1.1rem", sm: "1.3rem" },
                  position: "relative",
                  zIndex: 2,
                  lineHeight: 1.2,
                }}
              >
                {formattedDate}
              </Typography>
            </Box>
          </Fade>

          {/* Right: Refresh Button */}
          <Fade in timeout={800}>
            <Tooltip title="Refresh data" arrow>
              <IconButton
                onClick={onRefresh}
                disabled={isLoading}
                sx={{
                  background: colors.background.glass,
                  backdropFilter: "blur(10px)",
                  borderRadius: "12px",
                  border: `1px solid ${colors.border.primary}`,
                  color: colors.text.secondary,
                  width: { xs: 40, sm: 44 },
                  height: { xs: 40, sm: 44 },
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: colors.accent.success,
                    background: alpha(colors.accent.success, 0.08),
                    transform: "rotate(90deg)",
                    borderColor: colors.accent.success,
                  },
                  "&:disabled": {
                    opacity: 0.4,
                  },
                }}
              >
                <Refresh />
              </IconButton>
            </Tooltip>
          </Fade>
        </Box>

        {/* Bottom Row - View Types and Symbol Selector */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: { xs: "wrap", md: "nowrap" },
          }}
        >
          {/* Left: View Type Selector */}
          <Zoom in timeout={900}>
            <Box
              sx={{
                background: colors.background.glass,
                backdropFilter: "blur(15px)",
                borderRadius: "18px",
                border: `1px solid ${colors.border.primary}`,
                padding: "4px",
                boxShadow: `0 4px 12px ${alpha("#000000", 0.08)}`,
                display: "flex",
                gap: "3px",
                order: { xs: 2, md: 1 },
                width: { xs: "100%", md: "auto" },
                justifyContent: { xs: "space-around", md: "flex-start" },
              }}
            >
              {Object.values(VIEW_TYPES).map((type) => {
                const IconComponent = viewTypeIcons[type];
                const isActive = viewType === type;
                return (
                  <Tooltip
                    key={type}
                    title={`${
                      type.charAt(0).toUpperCase() + type.slice(1)
                    } view`}
                    arrow
                  >
                    <Button
                      variant="text"
                      onClick={() => onViewTypeChange(type)}
                      disabled={isLoading}
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        minWidth: { xs: "auto", sm: "80px" },
                        height: { xs: "38px", sm: "42px" },
                        borderRadius: "14px",
                        textTransform: "capitalize",
                        fontWeight: 600,
                        fontSize: { xs: "0.7rem", sm: "0.8rem" },
                        flex: { xs: "1", md: "0 0 auto" },
                        background: isActive
                          ? `linear-gradient(135deg, 
                            ${colors.accent.primary} 0%, 
                            ${colors.accent.secondary} 100%)`
                          : "transparent",
                        color: isActive ? "#ffffff" : colors.text.secondary,
                        border: isActive
                          ? "none"
                          : `1px solid ${alpha(colors.border.primary, 0.5)}`,
                        boxShadow: isActive
                          ? `0 4px 12px ${alpha(colors.accent.primary, 0.3)}`
                          : "none",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          transform: isActive
                            ? "translateY(-1px)"
                            : "scale(1.02)",
                          background: isActive
                            ? `linear-gradient(135deg, 
                              ${colors.accent.secondary} 0%, 
                              ${colors.accent.primary} 100%)`
                            : alpha(colors.accent.primary, 0.06),
                          color: isActive ? "#ffffff" : colors.accent.primary,
                          boxShadow: isActive
                            ? `0 6px 20px ${alpha(colors.accent.primary, 0.4)}`
                            : `0 2px 8px ${alpha(colors.accent.primary, 0.1)}`,
                        },
                        "&:disabled": {
                          opacity: 0.4,
                          transform: "none",
                        },
                        "& .MuiButton-startIcon": {
                          marginRight: { xs: 0, sm: "6px" },
                          marginLeft: 0,
                        },
                      }}
                      startIcon={
                        <IconComponent
                          sx={{ fontSize: { xs: "18px", sm: "20px" } }}
                        />
                      }
                    >
                      {!isMobile && type}
                    </Button>
                  </Tooltip>
                );
              })}
            </Box>
          </Zoom>

          {/* Right: Symbol Selector and Status */}
          <Fade in timeout={1000}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, sm: 1.5 },
                order: { xs: 1, md: 2 },
                width: { xs: "100%", md: "auto" },
                justifyContent: { xs: "space-between", md: "flex-end" },
                mb: { xs: 2, md: 0 },
              }}
            >
              {/* Symbol Selector */}
              <FormControl
                size="small"
                sx={{
                  minWidth: { xs: "140px", sm: "160px" },
                  maxWidth: { xs: "200px", sm: "220px" },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "14px",
                    background: colors.background.glass,
                    backdropFilter: "blur(10px)",
                    border: `1px solid ${colors.border.primary}`,
                    transition: "all 0.3s ease",
                    height: { xs: "38px", sm: "42px" },
                    "&:hover": {
                      border: `1px solid ${colors.border.accent}`,
                      transform: "translateY(-1px)",
                      boxShadow: `0 4px 12px ${alpha(
                        colors.accent.primary,
                        0.1
                      )}`,
                    },
                    "&.Mui-focused": {
                      border: `1px solid ${colors.accent.primary}`,
                      boxShadow: `0 0 0 3px ${alpha(
                        colors.accent.primary,
                        0.1
                      )}`,
                    },
                    "& fieldset": {
                      border: "none",
                    },
                  },
                }}
              >
                <Select
                  value={selectedSymbol}
                  onChange={(e) => onSymbolChange(e.target.value)}
                  disabled={isLoading}
                  displayEmpty
                  sx={{
                    "& .MuiSelect-select": {
                      padding: { xs: "8px 12px", sm: "10px 14px" },
                      fontSize: { xs: "0.75rem", sm: "0.8rem" },
                      fontWeight: 600,
                      color: colors.text.primary,
                      display: "flex",
                      alignItems: "center",
                    },
                  }}
                >
                  {CRYPTO_SYMBOLS.map((crypto) => (
                    <MenuItem key={crypto.symbol} value={crypto.symbol}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            color: colors.accent.primary,
                          }}
                        >
                          {crypto.shortName}
                        </Typography>
                        {!isMobile && (
                          <Typography
                            variant="caption"
                            sx={{ color: colors.text.secondary }}
                          >
                            {crypto.name}
                          </Typography>
                        )}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Status Chips */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 0.5, sm: 1 },
                  flexWrap: "wrap",
                }}
              >
                {dataRanges && !isMobile && (
                  <Tooltip
                    title={
                      <Box sx={{ p: 1 }}>
                        <Typography
                          variant="caption"
                          display="block"
                          sx={{ mb: 0.5 }}
                        >
                          📊 <strong>Data Ranges</strong>
                        </Typography>
                        <Typography variant="caption" display="block">
                          Volatility:{" "}
                          {dataRanges.volatilityRange.min.toFixed(1)}% -{" "}
                          {dataRanges.volatilityRange.max.toFixed(1)}%
                        </Typography>
                        <Typography variant="caption" display="block">
                          Volume: {dataRanges.volumeRange.min.toLocaleString()}{" "}
                          - {dataRanges.volumeRange.max.toLocaleString()}
                        </Typography>
                      </Box>
                    }
                    arrow
                  >
                    <Chip
                      icon={<TrendingUp sx={{ fontSize: "14px" }} />}
                      label="Ranges"
                      size="small"
                      sx={{
                        background: `linear-gradient(135deg, 
                          ${alpha(colors.accent.warning, 0.1)} 0%, 
                          ${alpha(colors.accent.warning, 0.05)} 100%)`,
                        border: `1px solid ${alpha(
                          colors.accent.warning,
                          0.2
                        )}`,
                        color: colors.accent.warning,
                        fontWeight: 600,
                        fontSize: "0.7rem",
                        height: "28px",
                        "&:hover": {
                          transform: "translateY(-1px)",
                          boxShadow: `0 4px 8px ${alpha(
                            colors.accent.warning,
                            0.2
                          )}`,
                        },
                      }}
                    />
                  </Tooltip>
                )}

                <Chip
                  icon={<AccessTime sx={{ fontSize: "12px" }} />}
                  label={
                    lastUpdated ? lastUpdated.toLocaleTimeString() : "No data"
                  }
                  size="small"
                  sx={{
                    background: lastUpdated
                      ? `linear-gradient(135deg, 
                        ${alpha(colors.accent.success, 0.1)} 0%, 
                        ${alpha(colors.accent.success, 0.05)} 100%)`
                      : `linear-gradient(135deg, 
                        ${alpha(colors.text.secondary, 0.1)} 0%, 
                        ${alpha(colors.text.secondary, 0.05)} 100%)`,
                    border: `1px solid ${alpha(
                      lastUpdated
                        ? colors.accent.success
                        : colors.text.secondary,
                      0.2
                    )}`,
                    color: lastUpdated
                      ? colors.accent.success
                      : colors.text.secondary,
                    fontWeight: 600,
                    fontSize: "0.65rem",
                    height: "28px",
                    "&:hover": {
                      transform: "translateY(-1px)",
                      boxShadow: `0 4px 8px ${alpha(
                        lastUpdated
                          ? colors.accent.success
                          : colors.text.secondary,
                        0.2
                      )}`,
                    },
                  }}
                />

                {enableKeyboardNavigation && !isMobile && (
                  <Tooltip
                    title="Use ← → to navigate, Enter to select, Escape to cancel"
                    arrow
                  >
                    <Chip
                      label="⌨️"
                      size="small"
                      sx={{
                        background: alpha(colors.accent.primary, 0.08),
                        border: `1px solid ${alpha(
                          colors.accent.primary,
                          0.2
                        )}`,
                        color: colors.accent.primary,
                        fontWeight: 600,
                        fontSize: "0.7rem",
                        minWidth: "28px",
                        height: "28px",
                        "&:hover": {
                          transform: "scale(1.05)",
                          background: alpha(colors.accent.primary, 0.12),
                        },
                      }}
                    />
                  </Tooltip>
                )}
              </Box>
            </Box>
          </Fade>
        </Box>
      </Box>
    </Box>
  );
};

export default CalendarHeader;
