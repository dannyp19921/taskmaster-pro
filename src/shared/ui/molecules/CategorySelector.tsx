// /src/shared/ui/molecules/CategorySelector.tsx - Gjenbrukbar kategori-velger! 🏷️

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';
import { CATEGORY_OPTIONS, CategoryOption } from '../../utils/categories';

interface CategorySelectorProps {
  label?: string;
  value: string;
  onCategoryChange: (category: string) => void;
  options?: CategoryOption[]; // Allow custom categories
  disabled?: boolean;
  testID?: string;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  label = "Kategori *",
  value,
  onCategoryChange,
  options = CATEGORY_OPTIONS,
  disabled = false,
  testID = "category-selector",
}) => {
  return (
    <View style={styles.container} testID={testID}>
      {label && (
        <Text variant="subtitle2" color="primary" style={styles.label}>
          {label}
        </Text>
      )}
      
      <View style={styles.buttonContainer}>
        {options.map((category) => (
          <Button
            key={category.value}
            variant={value === category.value ? 'primary' : 'secondary'}
            size="small"
            onPress={() => onCategoryChange(category.value)}
            disabled={disabled}
            style={{
              ...styles.categoryButton,
              borderColor: category.color,
              backgroundColor: value === category.value ? category.color : 'transparent',
            }}
            testID={`${testID}-${category.value.toLowerCase()}`}
          >
            {category.label}
          </Button>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryButton: {
    marginRight: 8,
    marginBottom: 8,
  },
});