// /src/shared/ui/organisms/EmptyState.tsx - Fixed styling! 🌕
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from './Button';
import { Text } from './Text';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'default' | 'search' | 'filter' | 'error';
  testID?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'default',
  testID = "empty-state",
}) => {
  
  const getDefaultIcon = () => {
    switch (variant) {
      case 'search': return '🔍';
      case 'filter': return '🎛️';
      case 'error': return '⚠️';
      default: return '📝';
    }
  };

  const getIconSize = () => {
    return variant === 'error' ? 32 : 48;
  };

  const getIconOpacity = () => {
    return variant === 'error' ? 0.8 : 0.5;
  };

  return (
    <View style={styles.container} testID={testID}>
      <Text 
        variant="h1" 
        style={{
          fontSize: getIconSize(),
          marginBottom: 16,
          opacity: getIconOpacity(),
        }}
      >
        {icon || getDefaultIcon()}
      </Text>
      
      <Text 
        variant="h6" 
        color="primary" 
        align="center"
        style={styles.title}
      >
        {title}
      </Text>
      
      {description && (
        <Text 
          variant="body1" 
          color="secondary" 
          align="center"
          style={styles.description}
        >
          {description}
        </Text>
      )}
      
      {actionLabel && onAction && (
        <Button
          variant="primary"
          size="medium"
          onPress={onAction}
          style={styles.actionButton}
        >
          {actionLabel}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 40,
    paddingTop: 50,
  },
  title: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 24,
    lineHeight: 24,
  },
  actionButton: {
    minWidth: 200,
  },
});