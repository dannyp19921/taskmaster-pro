// /src/shared/ui/molecules/TaskActions.tsx - Task action buttons molecule! 🎛️

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';
import { useTheme } from '../../../context/ThemeContext';

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

  return (
    <View style={styles.container} testID={testID}>
      {/* 🔧 Toggle Selection Indicator */}
      <Button
        variant="secondary"
        size="small"
        onPress={onToggleSelect}
        disabled={disabled}
        style={{
          ...styles.toggleButton,
          backgroundColor: isDarkMode ? '#4a4a4a' : '#f0f0f0',
          borderColor: isSelected ? theme.error : theme.border,
        }}
        testID={`${testID}-toggle`}
      >
        <Text 
          variant="button"
          style={{ 
            color: isSelected ? theme.error : theme.textTertiary,
            fontSize: 12,
          }}
        >
          {isSelected ? '✕' : '⋯'}
        </Text>
      </Button>

      {/* ✏️ Edit Button */}
      <Button
        variant="info"
        size="small"
        onPress={onEdit}
        disabled={disabled}
        style={styles.editButton}
        testID={`${testID}-edit`}
      >
        <Text variant="button" style={{ color: '#fff', fontSize: 12 }}>
          ✏️
        </Text>
      </Button>

      {/* 🗑️ Delete Button (appears when selected) */}
      {isSelected && (
        <View style={styles.deleteButtonContainer}>
          <Button
            variant="secondary"
            size="medium"
            onPress={onDelete}
            disabled={disabled}
            style={{
              ...styles.deleteButton,
              backgroundColor: theme.error,
            }}
            testID={`${testID}-delete`}
          >
            <Text variant="button" style={styles.deleteButtonText}>
              🗑️ Slett
            </Text>
          </Button>
        </View>
      )}
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
  deleteButtonContainer: {
    position: 'absolute',
    right: -90,
    top: -8,
    zIndex: 10,
  },
  deleteButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});