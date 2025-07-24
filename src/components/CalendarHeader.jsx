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
  ButtonGroup,
  Button,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Today,
  ViewDay,
  ViewWeek,
  CalendarViewMonth,
  Refresh,
  Info,
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

  // Last updated display
  const lastUpdatedDisplay = lastUpdated
    ? `Updated: ${lastUpdated.toLocaleTimeString()}`
    : "No data";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px",
        borderBottom: "1px solid #e0e0e0",
        backgroundColor: "#fafafa",
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      {/* Left Section - Date Navigation */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Tooltip title="Previous period">
          <IconButton
            onClick={() => onDateChange("previous")}
            disabled={isLoading}
            size="small"
          >
            <ChevronLeft />
          </IconButton>
        </Tooltip>

        <Typography
          variant="h6"
          sx={{
            minWidth: "200px",
            textAlign: "center",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          onClick={onToday}
        >
          {formattedDate}
        </Typography>

        <Tooltip title="Next period">
          <IconButton
            onClick={() => onDateChange("next")}
            disabled={isLoading}
            size="small"
          >
            <ChevronRight />
          </IconButton>
        </Tooltip>

        <Tooltip title="Go to today">
          <IconButton
            onClick={onToday}
            disabled={isLoading}
            size="small"
            sx={{ ml: 1 }}
          >
            <Today />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Center Section - View Type Selector */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="body2" sx={{ mr: 1 }}>
          View:
        </Typography>
        <ButtonGroup size="small" variant="outlined">
          {Object.values(VIEW_TYPES).map((type) => {
            const IconComponent = viewTypeIcons[type];
            return (
              <Tooltip
                key={type}
                title={`${type.charAt(0).toUpperCase() + type.slice(1)} view`}
              >
                <Button
                  variant={viewType === type ? "contained" : "outlined"}
                  onClick={() => onViewTypeChange(type)}
                  disabled={isLoading}
                  startIcon={<IconComponent />}
                  sx={{ textTransform: "capitalize" }}
                >
                  {type}
                </Button>
              </Tooltip>
            );
          })}
        </ButtonGroup>
      </Box>

      {/* Right Section - Symbol Selector and Controls */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* Cryptocurrency Symbol Selector */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={selectedSymbol}
            onChange={(e) => onSymbolChange(e.target.value)}
            disabled={isLoading}
            displayEmpty
          >
            {CRYPTO_SYMBOLS.map((crypto) => (
              <MenuItem key={crypto.symbol} value={crypto.symbol}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {crypto.shortName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {crypto.name}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Status Indicators */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {dataRanges && (
            <Tooltip
              title={
                <Box>
                  <Typography variant="caption" display="block">
                    Volatility Range:{" "}
                    {dataRanges.volatilityRange.min.toFixed(1)}% -{" "}
                    {dataRanges.volatilityRange.max.toFixed(1)}%
                  </Typography>
                  <Typography variant="caption" display="block">
                    Volume Range: {dataRanges.volumeRange.min.toLocaleString()}{" "}
                    - {dataRanges.volumeRange.max.toLocaleString()}
                  </Typography>
                </Box>
              }
            >
              <Chip
                icon={<Info />}
                label="Data Ranges"
                size="small"
                variant="outlined"
                clickable
              />
            </Tooltip>
          )}

          <Chip
            label={lastUpdatedDisplay}
            size="small"
            color={lastUpdated ? "success" : "default"}
            variant="outlined"
          />

          {enableKeyboardNavigation && (
            <Tooltip title="Use arrow keys to navigate, Enter to select, Escape to cancel">
              <Chip label="⌨️ Nav" size="small" variant="outlined" />
            </Tooltip>
          )}
        </Box>

        {/* Refresh Button */}
        <Tooltip title="Refresh data">
          <IconButton
            onClick={onRefresh}
            disabled={isLoading}
            size="small"
            sx={{
              animation: isLoading ? "spin 1s linear infinite" : "none",
              "@keyframes spin": {
                "0%": { transform: "rotate(0deg)" },
                "100%": { transform: "rotate(360deg)" },
              },
            }}
          >
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default CalendarHeader;
