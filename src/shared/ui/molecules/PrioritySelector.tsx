// /src/shared/ui/molecules/PrioritySelector.tsx - Gjenbrukbar prioritet-velger! ⚡

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';

export type Priority = 'Low' | 'Medium' | 'High';

interface PriorityOption {
  value: Priority;
  label: string;
  color: string;
}

const PRIORITY_OPTIONS: PriorityOption[] = [
  { value: 'Low', label: '🟢 Lav', color: '#4CAF50' },
  { value: 'Medium', label: '🟡 Medium', color: '#FF9800' },
  { value: 'High', label: '🔴 Høy', color: '#F44336' },
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
  return (
    <View style={styles.container} testID={testID}>
      {label && (
        <Text variant="subtitle2" color="primary" style={styles.label}>
          {label}
        </Text>
      )}
      
      <View style={styles.buttonContainer}>
        {PRIORITY_OPTIONS.map((option) => (
          <Button
            key={option.value}
            variant={value === option.value ? 'primary' : 'secondary'}
            size="small"
            onPress={() => onPriorityChange(option.value)}
            disabled={disabled}
            style={{
              ...styles.priorityButton,
              borderColor: option.color,
              backgroundColor: value === option.value ? option.color : 'transparent',
            }}
            testID={`${testID}-${option.value.toLowerCase()}`}
          >
            {option.label}
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
    marginHorizontal: -4,
  },
  priorityButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});