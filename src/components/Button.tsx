// /src/components/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'info';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  fullWidth?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  testID?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  onPress,
  style,
  testID,
}) => {
  const { theme } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: theme.info };
      case 'secondary':
        return { 
          backgroundColor: 'transparent', 
          borderColor: theme.border,
          borderWidth: 1,
        };
      case 'success':
        return { backgroundColor: theme.success };
      case 'info':
        return { backgroundColor: theme.info };
      default:
        return { backgroundColor: theme.info };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 8, paddingHorizontal: 12, fontSize: 12 };
      case 'medium':
        return { paddingVertical: 12, paddingHorizontal: 16, fontSize: 14 };
      case 'large':
        return { paddingVertical: 16, paddingHorizontal: 24, fontSize: 16 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 16, fontSize: 14 };
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.textSecondary;
    if (variant === 'secondary') return theme.textPrimary;
    return '#FFFFFF';
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variantStyles,
        {
          opacity: disabled ? 0.6 : 1,
          width: fullWidth ? '100%' : 'auto',
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
        },
        style,
      ]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      testID={testID}
      activeOpacity={disabled ? 1 : 0.8}
    >
      <Text style={[
        styles.text,
        {
          color: getTextColor(),
          fontSize: sizeStyles.fontSize,
          fontWeight: variant === 'secondary' ? '500' : '600',
        }
      ]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  text: {
    textAlign: 'center',
  },
});