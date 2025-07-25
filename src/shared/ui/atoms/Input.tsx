// /src/shared/ui/atoms/Input.tsx - Complete with error and textarea support
import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

export type InputVariant = 'default' | 'search' | 'textarea';
export type InputSize = 'small' | 'medium' | 'large';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  variant?: InputVariant;
  size?: InputSize;
  leftIcon?: string;
  rightIcon?: string;
  disabled?: boolean;
  testID?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  variant = 'default',
  size = 'medium',
  leftIcon,
  rightIcon,
  disabled = false,
  testID,
  ...textInputProps
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 8, paddingHorizontal: 12, fontSize: 12 };
      case 'medium':
        return { paddingVertical: 12, paddingHorizontal: 16, fontSize: 14 };
      case 'large':
        return { paddingVertical: 16, paddingHorizontal: 20, fontSize: 16 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 16, fontSize: 14 };
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'search':
        return {
          borderRadius: 25,
          backgroundColor: theme.cardBackground,
        };
      case 'textarea':
        return {
          minHeight: 100,
          textAlignVertical: 'top' as const,
        };
      default:
        return {};
    }
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  const getBorderColor = () => {
    if (error) return '#F44336'; // Red for errors
    if (isFocused) return theme.info;
    return theme.border;
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: theme.textPrimary }]}>
          {label}
        </Text>
      )}
      
      <View style={[
        styles.inputContainer,
        {
          borderColor: getBorderColor(),
          backgroundColor: disabled ? theme.background : theme.cardBackground,
        },
        variantStyles,
      ]}>
        {leftIcon && (
          <Text style={[styles.icon, { color: theme.textSecondary }]}>
            {leftIcon}
          </Text>
        )}
        
        <TextInput
          style={[
            styles.input,
            {
              color: theme.textPrimary,
              flex: 1,
              fontSize: sizeStyles.fontSize,
              paddingVertical: sizeStyles.paddingVertical,
              paddingHorizontal: sizeStyles.paddingHorizontal,
            },
            variantStyles,
          ]}
          placeholderTextColor={theme.textSecondary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={!disabled}
          multiline={variant === 'textarea'}
          testID={testID}
          {...textInputProps}
        />
        
        {rightIcon && (
          <Text style={[styles.icon, { color: theme.textSecondary }]}>
            {rightIcon}
          </Text>
        )}
      </View>

      {error && (
        <Text style={[styles.errorText, { color: '#F44336' }]}>
          {error}
        </Text>
      )}

      {hint && !error && (
        <Text style={[styles.hintText, { color: theme.textSecondary }]}>
          {hint}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 0,
  },
  icon: {
    fontSize: 16,
    marginHorizontal: 4,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  hintText: {
    fontSize: 12,
    marginTop: 4,
  },
});