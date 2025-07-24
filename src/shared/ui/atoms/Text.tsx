// /src/shared/ui/atoms/Text.tsx - Simplified version
import React from 'react';
import { Text as RNText, TextStyle } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

export type TextVariant = 
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'body1' | 'body2' | 'caption'
  | 'button' | 'subtitle1' | 'subtitle2';

export type TextColor = 'primary' | 'secondary' | 'success' | 'warning' | 'info';

interface TextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: TextColor | string;
  align?: 'left' | 'center' | 'right' | 'justify';
  weight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  italic?: boolean;
  numberOfLines?: number;
  style?: TextStyle;
  testID?: string;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body1',
  color = 'primary',
  align = 'left',
  weight,
  italic = false,
  numberOfLines,
  style,
  testID,
}) => {
  const { theme } = useTheme();

  const getVariantStyles = (): TextStyle => {
    switch (variant) {
      case 'h1':
        return { fontSize: 32, fontWeight: 'bold', lineHeight: 40 };
      case 'h2':
        return { fontSize: 28, fontWeight: 'bold', lineHeight: 36 };
      case 'h3':
        return { fontSize: 24, fontWeight: '600', lineHeight: 32 };
      case 'h4':
        return { fontSize: 20, fontWeight: '600', lineHeight: 28 };
      case 'h5':
        return { fontSize: 18, fontWeight: '600', lineHeight: 24 };
      case 'h6':
        return { fontSize: 16, fontWeight: '600', lineHeight: 22 };
      case 'subtitle1':
        return { fontSize: 16, fontWeight: '500', lineHeight: 24 };
      case 'subtitle2':
        return { fontSize: 14, fontWeight: '500', lineHeight: 20 };
      case 'body1':
        return { fontSize: 16, fontWeight: 'normal', lineHeight: 24 };
      case 'body2':
        return { fontSize: 14, fontWeight: 'normal', lineHeight: 20 };
      case 'button':
        return { fontSize: 14, fontWeight: '600', lineHeight: 20 };
      case 'caption':
        return { fontSize: 12, fontWeight: 'normal', lineHeight: 16 };
      default:
        return { fontSize: 16, fontWeight: 'normal', lineHeight: 24 };
    }
  };

  const getTextColor = (): string => {
    if (typeof color === 'string') {
      switch (color) {
        case 'primary':
          return theme.textPrimary;
        case 'secondary':
          return theme.textSecondary;
        case 'success':
          return theme.success;
        case 'warning':
          return theme.warning;
        case 'info':
          return theme.info;
        default:
          return color.startsWith('#') || color.startsWith('rgb') ? color : theme.textPrimary;
      }
    }
    return theme.textPrimary;
  };

  const variantStyles = getVariantStyles();

  return (
    <RNText
      style={[
        variantStyles,
        {
          color: getTextColor(),
          textAlign: align,
          fontWeight: weight || variantStyles.fontWeight,
          fontStyle: italic ? 'italic' : 'normal',
        },
        style,
      ]}
      numberOfLines={numberOfLines}
      testID={testID}
    >
      {children}
    </RNText>
  );
};