// /src/components/TaskStatus.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../context/ThemeContext';

interface TaskStatusProps {
  dueDate: string;
  status: 'open' | 'completed';
  priority: 'Low' | 'Medium' | 'High';
  category?: string;
  testID?: string;
}

export const TaskStatus: React.FC<TaskStatusProps> = ({
  dueDate,
  status,
  priority,
  testID = "task-status",
}) => {
  const { theme } = useTheme();

  const getDeadlineInfo = () => {
    const today = new Date();
    const deadline = new Date(dueDate);
    
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (daysDiff < 0) {
      return { 
        color: theme.overdue, 
        badge: 'UTLØPT', 
        message: `Utløpt for ${Math.abs(daysDiff)} dag${Math.abs(daysDiff) > 1 ? 'er' : ''} siden` 
      };
    } else if (daysDiff === 0) {
      return { color: theme.today, badge: 'I DAG!', message: 'Utløper i dag!' };
    } else if (daysDiff === 1) {
      return { color: theme.warning, badge: 'I MORGEN', message: 'Utløper i morgen' };
    } else if (daysDiff <= 3) {
      return { color: theme.soon, badge: `${daysDiff} DAGER`, message: `${daysDiff} dager igjen` };
    } else if (daysDiff <= 7) {
      return { color: theme.success, badge: `${daysDiff} DAGER`, message: `${daysDiff} dager igjen` };
    } else {
      return { color: theme.textTertiary, badge: null, message: `${daysDiff} dager igjen` };
    }
  };

  const getPriorityInfo = () => {
    switch (priority) {
      case 'High':
        return { icon: '🔴', color: theme.error, label: 'Høy' };
      case 'Medium':
        return { icon: '🟡', color: theme.warning, label: 'Medium' };
      case 'Low':
        return { icon: '🟢', color: theme.success, label: 'Lav' };
      default:
        return { icon: '⚪', color: theme.textSecondary, label: 'Ukjent' };
    }
  };

  const deadlineInfo = getDeadlineInfo();
  const priorityInfo = getPriorityInfo();
  const isCompleted = status === 'completed';

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.deadlineRow}>
        <Text variant="body2" color="secondary">
          📅 {dueDate}
        </Text>
        
        {!isCompleted && deadlineInfo.badge && (
          <View style={[styles.deadlineBadge, { backgroundColor: deadlineInfo.color }]}>
            <Text variant="caption" style={styles.badgeText}>
              {deadlineInfo.badge}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.statusRow}>
        <Text variant="body2" color="secondary">
          {priorityInfo.icon} {priorityInfo.label}
        </Text>
        
        <Text variant="body2" color={isCompleted ? 'success' : 'warning'}>
          {isCompleted ? '✅ Fullført' : '🔄 Aktiv'}
        </Text>
      </View>

      {!isCompleted && (
        <Text 
          variant="caption" 
          style={[
            styles.deadlineMessage,
            { 
              color: deadlineInfo.color, 
              fontWeight: '600',
            }
          ]}
        >
          ⏰ {deadlineInfo.message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  deadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deadlineBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deadlineMessage: {
    marginTop: 2,
  },
});