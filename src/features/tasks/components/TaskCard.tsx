// /src/features/tasks/components/TaskCard.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

import { Text } from '../../../shared/ui/atoms/Text';
import { TaskStatus } from '../../../shared/ui/molecules/TaskStatus';
import { TaskActions } from '../../../shared/ui/molecules/TaskActions';
import { CategoryBadge } from '../../../shared/ui/molecules/CategoryBadge';

interface Task {
  id: string;
  title: string;
  due_date: string;
  priority: 'Low' | 'Medium' | 'High';
  category?: string;
  status: 'open' | 'completed';
  user_id: string;
}

interface TaskCardProps {
  task: Task;
  isSelected: boolean;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
  testID?: string;
}

export default function TaskCard({ 
  task, 
  isSelected, 
  onPress, 
  onEdit, 
  onDelete,
  testID = "task-card"
}: TaskCardProps) {
  const { theme } = useTheme();
  const isCompleted = task.status === 'completed';

  const getDeadlineColor = () => {
    if (isCompleted) return theme.completed;
    
    const today = new Date();
    const deadline = new Date(task.due_date);
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (daysDiff < 0) return theme.overdue;
    if (daysDiff === 0) return theme.today;
    if (daysDiff <= 3) return theme.warning;
    return theme.success;
  };

  return (
    <View style={styles.container} testID={testID}>
      {/* Main Card */}
      <View style={[
        styles.card,
        { 
          backgroundColor: theme.cardBackground,
          borderColor: theme.border,
        },
        isCompleted && { opacity: 0.7 },
        !isCompleted && { 
          borderLeftWidth: 4, 
          borderLeftColor: getDeadlineColor() 
        },
      ]}>
        
        {/* Main Content Area */}
        <TouchableOpacity 
          onPress={onPress} 
          style={styles.content}
          testID={`${testID}-content`}
        >
          {/* Title Row */}
          <View style={styles.titleRow}>
            <Text 
              variant="subtitle1" 
              color="primary"
              numberOfLines={2}
              style={{
                ...styles.title,
                ...(isCompleted && { 
                  textDecorationLine: 'line-through' as const,
                  color: theme.textTertiary 
                })
              }}
            >
              {task.title}
            </Text>
            
            {/* Completion Indicator */}
            {isCompleted && (
              <Text variant="h6" style={{ color: theme.completed }}>
                ✓
              </Text>
            )}
          </View>
          
          {/* Category Badge */}
          <CategoryBadge 
            category={task.category} 
            size="small"
            testID={`${testID}-category`}
          />
          
          {/* Status Information */}
          <TaskStatus
            dueDate={task.due_date}
            status={task.status}
            priority={task.priority}
            category={task.category}
            testID={`${testID}-status`}
          />
        </TouchableOpacity>
        
        {/* Action Buttons */}
        <TaskActions
          isSelected={isSelected}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleSelect={onPress}
          testID={`${testID}-actions`}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    position: 'relative',
  },
  card: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    marginRight: 8,
  },
});