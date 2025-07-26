import React from 'react';
import { Box, Typography, Button, Alert, AlertTitle } from '@mui/material';
import { ErrorOutline, Refresh } from '@mui/icons-material';

/**
 * Error Boundary Component
 * Catches and handles JavaScript errors in the component tree
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Send error to monitoring service if available
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  render() {
    if (this.state.hasError) {
      // Custom error UI
      return (
        <Box
          sx={{
            p: 4,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            borderRadius: 2,
            border: '1px solid #e2e8f0',
            maxWidth: 600,
            mx: 'auto',
            mt: 4
          }}
        >
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ErrorOutline />
                Something went wrong
              </Box>
            </AlertTitle>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {this.props.fallbackMessage || 
                'An unexpected error occurred. Please try refreshing the page.'}
            </Typography>
          </Alert>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <Box sx={{ textAlign: 'left', mb: 3 }}>
              <Typography variant="h6" color="error" sx={{ mb: 1 }}>
                Error Details:
              </Typography>
              <Box
                component="pre"
                sx={{
                  p: 2,
                  bgcolor: '#f5f5f5',
                  borderRadius: 1,
                  fontSize: '0.8rem',
                  overflow: 'auto',
                  maxHeight: 200,
                  border: '1px solid #ddd'
                }}
              >
                {this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </Box>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={this.handleRetry}
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                }
              }}
            >
              Try Again
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => window.location.reload()}
              sx={{
                borderColor: '#6366f1',
                color: '#6366f1',
                '&:hover': {
                  borderColor: '#4f46e5',
                  backgroundColor: 'rgba(99, 102, 241, 0.04)'
                }
              }}
            >
              Reload Page
            </Button>
          </Box>

          {this.state.retryCount > 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
              Retry attempts: {this.state.retryCount}
            </Typography>
          )}
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
