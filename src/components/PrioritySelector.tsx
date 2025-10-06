// /src/components/PrioritySelector.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from './Button';
import { Text } from './Text';
import { useTheme } from '../context/ThemeContext';

export type Priority = 'Low' | 'Medium' | 'High';

interface PriorityOption {
  value: Priority;
  label: string;
  colorKey: 'success' | 'warning' | 'error';
}

const PRIORITY_OPTIONS: PriorityOption[] = [
  { value: 'Low', label: '🟢 Lav', colorKey: 'success' },
  { value: 'Medium', label: '🟡 Medium', colorKey: 'warning' },
  { value: 'High', label: '🔴 Høy', colorKey: 'error' },
];

interface PrioritySelectorProps {
  label?: string;
  value: Priority;
  onPriorityChange: (priority: Priority) => void;
  disabled?: boolean;
  testID?: string;
}

export const PrioritySelector: React.FC<PrioritySelectorProps> = ({
  label = "Prioritet *",
  value,
  onPriorityChange,
  disabled = false,
  testID = "priority-selector",
}) => {
  const { theme } = useTheme();

  const getColor = (colorKey: 'success' | 'warning' | 'error') => {
    return theme[colorKey];
  };

  return (
    <View style={styles.container} testID={testID}>
      {label && (
        <Text variant="subtitle2" color="primary" style={styles.label}>
          {label}
        </Text>
      )}
      
      <View style={styles.buttonContainer}>
        {PRIORITY_OPTIONS.map((option) => {
          const color = getColor(option.colorKey);
          return (
            <Button
              key={option.value}
              variant={value === option.value ? 'primary' : 'secondary'}
              size="small"
              onPress={() => onPriorityChange(option.value)}
              disabled={disabled}
              style={[
                styles.priorityButton,
                {
                  borderColor: color,
                  backgroundColor: value === option.value ? color : 'transparent',
                }
              ]}
              testID={`${testID}-${option.value.toLowerCase()}`}
            >
              {option.label}
            </Button>
          );
        })}
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
    marginHorizontal: -4,
  },
  priorityButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});