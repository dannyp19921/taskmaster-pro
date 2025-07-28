// /src/shared/ui/organisms/ErrorBoundary.tsx - Production error boundary! 🛡️

import React, { Component, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
  testID?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state to show fallback UI
    return { 
      hasError: true, 
      error,
      errorInfo: null 
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log error to console and external service
    console.error('🚨 ErrorBoundary caught an error:', error);
    console.error('📊 Error info:', errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Call custom error handler
    this.props.onError?.(error, errorInfo);
    
    // TODO: Send to error reporting service (Sentry, Bugsnag, etc.)
    // logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <View style={styles.container} testID={this.props.testID || "error-boundary"}>
          <View style={styles.errorCard}>
            <Text variant="h1" style={styles.errorIcon}>
              🚨
            </Text>
            
            <Text variant="h4" color="primary" align="center" style={styles.title}>
              Oops! Noe gikk galt
            </Text>
            
            <Text variant="body1" color="secondary" align="center" style={styles.description}>
              En uventet feil oppstod i appen. Dette er ikke din feil - det er vår.
            </Text>

            <View style={styles.actions}>
              <Button
                variant="primary"
                size="large"
                onPress={this.handleRetry}
                style={styles.retryButton}
                testID="error-boundary-retry"
              >
                🔄 Prøv igjen
              </Button>
            </View>

            {/* Development info - only show in dev mode */}
            {__DEV__ && this.state.error && (
              <View style={styles.devInfo}>
                <Text variant="caption" color="secondary" style={styles.devTitle}>
                  🔧 Dev Info:
                </Text>
                <Text variant="caption" color="secondary" style={styles.errorMessage}>
                  {this.state.error.toString()}
                </Text>
                {this.state.errorInfo?.componentStack && (
                  <Text variant="caption" color="secondary" style={styles.stackTrace}>
                    {this.state.errorInfo.componentStack.slice(0, 200)}...
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  errorCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.8,
  },
  title: {
    marginBottom: 12,
  },
  description: {
    marginBottom: 24,
    lineHeight: 24,
  },
  actions: {
    width: '100%',
    marginBottom: 16,
  },
  retryButton: {
    width: '100%',
  },
  devInfo: {
    width: '100%',
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b35',
  },
  devTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  errorMessage: {
    fontFamily: 'monospace',
    fontSize: 11,
    marginBottom: 8,
    color: '#d32f2f',
  },
  stackTrace: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#666',
  },
});