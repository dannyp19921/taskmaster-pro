// /src/components/CategoryBadge.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { getCategoryInfo } from '../shared/utils/categories';

interface CategoryBadgeProps {
  category?: string;
  size?: 'small' | 'medium' | 'large';
  testID?: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  size = 'medium',
  testID = "category-badge",
}) => {
  const categoryInfo = getCategoryInfo(category || 'Personlig');

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: 6,
          paddingVertical: 2,
          borderRadius: 8,
          fontSize: 10,
        };
      case 'medium':
        return {
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 12,
          fontSize: 12,
        };
      case 'large':
        return {
          paddingHorizontal: 14,
          paddingVertical: 6,
          borderRadius: 16,
          fontSize: 14,
        };
      default:
        return {
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 12,
          fontSize: 12,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View 
      style={[
        styles.badge,
        {
          backgroundColor: categoryInfo.color,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          paddingVertical: sizeStyles.paddingVertical,
          borderRadius: sizeStyles.borderRadius,
        }
      ]}
      testID={testID}
    >
      <Text 
        variant="caption"
        style={{
          ...styles.badgeText,
          fontSize: sizeStyles.fontSize,
        }}
      >
        {categoryInfo.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});