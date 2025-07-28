// /src/shared/ui/molecules/LoadingOverlay.tsx - Professional loading overlay! 🔄

import React from 'react';
import { View, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import { Text } from '../atoms/Text';
import { useTheme } from '../../../context/ThemeContext';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  transparent?: boolean;
  size?: 'small' | 'large';
  testID?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = "Laster...",
  transparent = false,
  size = 'large',
  testID = "loading-overlay",
}) => {
  const { theme } = useTheme();

  if (!visible) return null;

  const content = (
    <View 
      style={[
        styles.overlay,
        { 
          backgroundColor: transparent 
            ? 'rgba(0,0,0,0.3)' 
            : theme.background 
        }
      ]}
      testID={testID}
    >
      <View 
        style={[
          styles.container,
          { 
            backgroundColor: theme.cardBackground,
            borderColor: theme.border,
          }
        ]}
      >
        <ActivityIndicator 
          size={size} 
          color={theme.info} 
          style={styles.spinner}
        />
        
        <Text 
          variant="body1" 
          color="primary" 
          align="center"
          style={styles.message}
        >
          {message}
        </Text>
      </View>
    </View>
  );

  return transparent ? (
    <Modal 
      visible={visible} 
      transparent 
      animationType="fade"
      testID={`${testID}-modal`}
    >
      {content}
    </Modal>
  ) : (
    content
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 32,
    alignItems: 'center',
    minWidth: 200,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  spinner: {
    marginBottom: 16,
  },
  message: {
    fontWeight: '500',
  },
});