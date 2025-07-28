// /src/shared/ui/organisms/NetworkError.tsx - Network error handling! 📡

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';
import { useTheme } from '../../../context/ThemeContext';

interface NetworkErrorProps {
  error?: string;
  onRetry?: () => void;
  onGoBack?: () => void;
  variant?: 'connection' | 'timeout' | 'server' | 'auth' | 'generic';
  fullScreen?: boolean;
  testID?: string;
}

export const NetworkError: React.FC<NetworkErrorProps> = ({
  error,
  onRetry,
  onGoBack,
  variant = 'generic',
  fullScreen = false,
  testID = "network-error",
}) => {
  const { theme } = useTheme();

  // 🎯 Get error details based on variant
  const getErrorDetails = () => {
    switch (variant) {
      case 'connection':
        return {
          icon: '📡',
          title: 'Ingen internettforbindelse',
          description: 'Sjekk nettverksforbindelsen din og prøv igjen.',
          actionLabel: '🔄 Prøv igjen',
        };
      case 'timeout':
        return {
          icon: '⏱️',
          title: 'Forespørsel tidsløp ut',
          description: 'Serveren brukte for lang tid å svare. Prøv igjen.',
          actionLabel: '🔄 Prøv igjen',
        };
      case 'server':
        return {
          icon: '🔧',
          title: 'Serverproblem',
          description: 'Det er et problem på vår side. Vi jobber med å fikse det.',
          actionLabel: '🔄 Prøv igjen',
        };
      case 'auth':
        return {
          icon: '🔐',
          title: 'Sesjonen utløpt',
          description: 'Du må logge inn på nytt for å fortsette.',
          actionLabel: '🔐 Logg inn igjen',
        };
      default:
        return {
          icon: '⚠️',
          title: 'Noe gikk galt',
          description: error || 'En uventet feil oppstod. Prøv igjen.',
          actionLabel: '🔄 Prøv igjen',
        };
    }
  };

  const errorDetails = getErrorDetails();

  const containerStyle = fullScreen 
    ? [styles.fullScreenContainer, { backgroundColor: theme.background }]
    : [styles.inlineContainer, { backgroundColor: theme.cardBackground, borderColor: theme.border }];

  return (
    <View style={containerStyle} testID={testID}>
      <Text variant="h1" style={styles.icon}>
        {errorDetails.icon}
      </Text>
      
      <Text 
        variant={fullScreen ? "h4" : "h6"} 
        color="primary" 
        align="center"
        style={styles.title}
      >
        {errorDetails.title}
      </Text>
      
      <Text 
        variant="body1" 
        color="secondary" 
        align="center"
        style={styles.description}
      >
        {errorDetails.description}
      </Text>

      <View style={styles.actions}>
        {onRetry && (
          <Button
            variant="primary"
            size={fullScreen ? "large" : "medium"}
            onPress={onRetry}
            style={styles.primaryButton}
            testID={`${testID}-retry`}
          >
            {errorDetails.actionLabel}
          </Button>
        )}
        
        {onGoBack && (
          <Button
            variant="secondary"
            size={fullScreen ? "medium" : "small"}
            onPress={onGoBack}
            style={styles.secondaryButton}
            testID={`${testID}-back`}
          >
            ← Gå tilbake
          </Button>
        )}
      </View>

      {/* 💡 Help section for connection errors */}
      {variant === 'connection' && (
        <View style={[styles.helpSection, { backgroundColor: theme.background, borderColor: theme.border }]}>
          <Text variant="caption" color="secondary" align="center">
            💡 Tips: Sjekk WiFi, mobildata eller prøv å bevege deg til et område med bedre dekning
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  inlineContainer: {
    alignItems: 'center',
    padding: 24,
    margin: 20,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
    opacity: 0.8,
  },
  title: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 24,
    lineHeight: 22,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    width: '100%',
  },
  secondaryButton: {
    width: '100%',
  },
  helpSection: {
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    width: '100%',
  },
});