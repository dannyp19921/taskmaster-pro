// /src/components/TaskActions.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from './Button';
import { Text } from './Text';
import { useTheme } from '../context/ThemeContext';

interface TaskActionsProps {
  isSelected: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleSelect: () => void;
  disabled?: boolean;
  testID?: string;
}

export const TaskActions: React.FC<TaskActionsProps> = ({
  isSelected,
  onEdit,
  onDelete,
  onToggleSelect,
  disabled = false,
  testID = "task-actions",
}) => {
  const { theme, isDarkMode } = useTheme();

  if (isSelected) {
    return (
      <View style={styles.container} testID={testID}>
        <Button
          variant="secondary"
          size="small"
          onPress={onToggleSelect}
          disabled={disabled}
          style={styles.closeButton}
          testID={`${testID}-close`}
        >
          <Text variant="button" style={{ color: theme.textSecondary, fontSize: 12 }}>
            ✕
          </Text>
        </Button>

        <Button
          variant="secondary"
          size="medium"
          onPress={onDelete}
          disabled={disabled}
          style={[styles.deleteButton, { backgroundColor: theme.error }]}
          testID={`${testID}-delete`}
        >
          <Text variant="button" style={styles.deleteButtonText}>
            Slett
          </Text>
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container} testID={testID}>
      <Button
        variant="secondary"
        size="small"
        onPress={onToggleSelect}
        disabled={disabled}
        style={[
          styles.toggleButton,
          {
            backgroundColor: isDarkMode ? theme.cardBackground : theme.background,
            borderColor: theme.border,
          }
        ]}
        testID={`${testID}-toggle`}
      >
        <Text variant="button" style={{ color: theme.textTertiary, fontSize: 12 }}>
          ⋯
        </Text>
      </Button>

      <Button
        variant="info"
        size="small"
        onPress={onEdit}
        disabled={disabled}
        style={styles.editButton}
        testID={`${testID}-edit`}
      >
        <Text variant="button" style={{ color: '#FFFFFF', fontSize: 12 }}>
          ✏️
        </Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  deleteButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});