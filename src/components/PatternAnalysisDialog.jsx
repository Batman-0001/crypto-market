import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Divider,
  LinearProgress,
  Alert,
  AlertTitle,
} from "@mui/material";
import {
  Close,
  TrendingUp,
  TrendingDown,
  Timeline,
  ShowChart,
  BarChart,
  Warning,
  CheckCircle,
  Info,
} from "@mui/icons-material";
import {
  getPatternIcon,
  getPatternColor,
  PATTERN_TYPES,
} from "../utils/patternRecognition";

const PatternAnalysisDialog = ({
  open,
  onClose,
  patternAnalysis,
  symbol = "BTCUSDT",
}) => {
  const [selectedPattern, setSelectedPattern] = useState(null);

  if (!patternAnalysis) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Pattern Analysis
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Alert severity="info">
            <AlertTitle>No Pattern Data Available</AlertTitle>
            Pattern analysis will appear once market data is loaded and
            analyzed.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  const { patterns = [], summary = {}, totalPatterns = 0 } = patternAnalysis;

  const getPatternSeverity = (pattern) => {
    if (pattern.confidence >= 0.8) return "success";
    if (pattern.confidence >= 0.6) return "warning";
    return "info";
  };

  const getPatternDescription = (pattern) => {
    switch (pattern.type) {
      case PATTERN_TYPES.TREND:
        return `${pattern.subtype} trend detected with ${(
          pattern.confidence * 100
        ).toFixed(1)}% confidence`;
      case PATTERN_TYPES.SUPPORT_RESISTANCE:
        return `${pattern.subtype} level at $${pattern.level?.toFixed(
          2
        )} with ${pattern.touches} touches`;
      case PATTERN_TYPES.VOLATILITY_CLUSTER:
        return `High volatility period with ${(
          pattern.avgVolatility * 100
        ).toFixed(1)}% average volatility`;
      case PATTERN_TYPES.VOLUME_SPIKE:
        return `Volume spike detected: ${pattern.volumeMultiplier?.toFixed(
          1
        )}x normal volume`;
      case PATTERN_TYPES.ANOMALY:
        return `Unusual market behavior detected: ${pattern.anomalyType}`;
      default:
        return "Pattern detected in market data";
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Timeline sx={{ color: "#6366f1" }} />
          <Box>
            <Typography variant="h6" component="div">
              Pattern Analysis - {symbol}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {totalPatterns} patterns detected across {patterns.length} data
              points
            </Typography>
          </Box>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Summary Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {Object.entries(summary).map(([type, count]) => {
            if (count === 0) return null;

            const typeConfig = {
              trends: {
                icon: <TrendingUp />,
                color: "#4caf50",
                label: "Trends",
              },
              supportResistance: {
                icon: <BarChart />,
                color: "#ff9800",
                label: "Support/Resistance",
              },
              volatilityClusters: {
                icon: <Warning />,
                color: "#9c27b0",
                label: "Volatility Clusters",
              },
              volumeSpikes: {
                icon: <ShowChart />,
                color: "#00bcd4",
                label: "Volume Spikes",
              },
              anomalies: {
                icon: <Warning />,
                color: "#f44336",
                label: "Anomalies",
              },
              seasonal: {
                icon: <Timeline />,
                color: "#607d8b",
                label: "Seasonal",
              },
            };

            const config = typeConfig[type] || {
              icon: <Info />,
              color: "#2196f3",
              label: type,
            };

            return (
              <Grid item xs={6} sm={4} md={2} key={type}>
                <Card sx={{ textAlign: "center", minHeight: 100 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ color: config.color, mb: 1 }}>{config.icon}</Box>
                    <Typography variant="h6" component="div">
                      {count}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {config.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Patterns List */}
        <Typography variant="h6" gutterBottom>
          Detected Patterns
        </Typography>

        {patterns.length === 0 ? (
          <Alert severity="info">
            <AlertTitle>No Patterns Detected</AlertTitle>
            Try changing the analysis parameters or wait for more market data.
          </Alert>
        ) : (
          <List>
            {patterns.map((pattern, index) => (
              <ListItem
                key={index}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  mb: 1,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
                onClick={() => setSelectedPattern(pattern)}
              >
                <ListItemIcon>
                  <Typography fontSize="1.5rem">
                    {getPatternIcon(pattern)}
                  </Typography>
                </ListItemIcon>

                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="subtitle1" component="span">
                        {pattern.type.replace("_", " ").toUpperCase()}
                      </Typography>
                      {pattern.subtype && (
                        <Chip
                          label={pattern.subtype}
                          size="small"
                          sx={{
                            backgroundColor: getPatternColor(pattern),
                            color: "white",
                            fontSize: "0.7rem",
                          }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {getPatternDescription(pattern)}
                      </Typography>
                      {pattern.dateRange && (
                        <Typography variant="caption" color="text.secondary">
                          Period: {pattern.dateRange.start} to{" "}
                          {pattern.dateRange.end}
                        </Typography>
                      )}
                    </Box>
                  }
                />

                <Box sx={{ textAlign: "right" }}>
                  <LinearProgress
                    variant="determinate"
                    value={pattern.confidence * 100}
                    sx={{
                      width: 80,
                      mb: 0.5,
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: getPatternColor(pattern),
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {(pattern.confidence * 100).toFixed(1)}% confidence
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        )}

        {/* Selected Pattern Details */}
        {selectedPattern && (
          <Card
            sx={{
              mt: 3,
              border: "2px solid",
              borderColor: getPatternColor(selectedPattern),
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pattern Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Type
                  </Typography>
                  <Typography variant="body1">
                    {selectedPattern.type.replace("_", " ").toUpperCase()}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Confidence
                  </Typography>
                  <Typography variant="body1">
                    {(selectedPattern.confidence * 100).toFixed(1)}%
                  </Typography>
                </Grid>

                {selectedPattern.strength && (
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Strength
                    </Typography>
                    <Typography variant="body1">
                      {(selectedPattern.strength * 100).toFixed(1)}%
                    </Typography>
                  </Grid>
                )}

                {selectedPattern.duration && (
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Duration
                    </Typography>
                    <Typography variant="body1">
                      {selectedPattern.duration} days
                    </Typography>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Description
                  </Typography>
                  <Typography variant="body1">
                    {getPatternDescription(selectedPattern)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => setSelectedPattern(null)}
          disabled={!selectedPattern}
        >
          Clear Selection
        </Button>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatternAnalysisDialog;
