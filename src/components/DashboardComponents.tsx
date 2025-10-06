// /src/components/DashboardComponents.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../context/ThemeContext';

// 📊 StatCard Organism - Reusable statistics card
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color: string;
  icon: string;
  testID?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  color,
  icon,
  testID = "stat-card",
}) => {
  const { theme } = useTheme();

  return (
    <View 
      style={{
        ...styles.statCard,
        backgroundColor: theme.cardBackground,
        borderLeftColor: color,
        borderColor: theme.border,
      }}
      testID={testID}
    >
      <View style={styles.statHeader}>
        <Text variant="body2" style={styles.statIcon}>
          {icon}
        </Text>
        <Text variant="caption" color="secondary" style={styles.statTitle}>
          {title}
        </Text>
      </View>
      <Text variant="h2" style={{ color, fontWeight: 'bold', marginBottom: 4 }}>
        {value}
      </Text>
      {subtitle && (
        <Text variant="caption" color="secondary">
          {subtitle}
        </Text>
      )}
    </View>
  );
};

// 📈 ProgressBar Organism - Visual progress indicator  
interface ProgressBarProps {
  progress: number;
  color: string;
  label?: string;
  testID?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color,
  label,
  testID = "progress-bar",
}) => {
  const { theme } = useTheme();

  return (
    <View 
      style={{
        ...styles.progressSection,
        backgroundColor: theme.cardBackground,
        borderColor: theme.border,
      }}
      testID={testID}
    >
      {label && (
        <Text variant="subtitle2" color="primary" style={styles.progressLabel}>
          {label}
        </Text>
      )}
      <View style={styles.progressBarContainer}>
        <View style={{ ...styles.progressBarBackground, backgroundColor: theme.border }}>
          <View 
            style={{
              ...styles.progressBarFill,
              width: `${Math.min(progress, 100)}%`,
              backgroundColor: color
            }} 
          />
        </View>
        <Text variant="subtitle2" color="primary" style={styles.progressText}>
          {progress}%
        </Text>
      </View>
    </View>
  );
};

// 🏷️ CategoryList Organism - Category statistics display
interface CategoryListProps {
  categories: Array<{ value: string; label: string; color: string; count: number }>;
  testID?: string;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  testID = "category-list",
}) => {
  const { theme } = useTheme();

  if (categories.length === 0) {
    return null;
  }

  return (
    <View testID={testID}>
      {categories.map(cat => (
        <View 
          key={cat.value} 
          style={{
            ...styles.categoryItem,
            backgroundColor: theme.cardBackground,
            borderColor: theme.border,
          }}
          testID={`${testID}-${cat.value}`}
        >
          <View style={{ ...styles.categoryDot, backgroundColor: cat.color }} />
          <Text variant="body1" color="primary" style={styles.categoryLabel}>
            {cat.label}
          </Text>
          <Text variant="subtitle2" color="primary" style={styles.categoryValue}>
            {cat.count}
          </Text>
        </View>
      ))}
    </View>
  );
};

// ⚡ PriorityOverview Organism - Priority statistics display
interface PriorityOverviewProps {
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
  testID?: string;
}

export const PriorityOverview: React.FC<PriorityOverviewProps> = ({
  highPriority,
  mediumPriority,
  lowPriority,
  testID = "priority-overview",
}) => {
  const { theme } = useTheme();

  return (
    <View 
      style={{
        ...styles.priorityContainer,
        backgroundColor: theme.cardBackground,
        borderColor: theme.border,
      }}
      testID={testID}
    >
      <View style={styles.priorityItem}>
        <Text variant="body1" style={styles.priorityIcon}>🔴</Text>
        <Text variant="body1" color="primary" style={styles.priorityLabel}>
          Høy
        </Text>
        <Text variant="subtitle2" color="primary" style={styles.priorityValue}>
          {highPriority}
        </Text>
      </View>
      
      <View style={styles.priorityItem}>
        <Text variant="body1" style={styles.priorityIcon}>🟡</Text>
        <Text variant="body1" color="primary" style={styles.priorityLabel}>
          Medium
        </Text>
        <Text variant="subtitle2" color="primary" style={styles.priorityValue}>
          {mediumPriority}
        </Text>
      </View>
      
      <View style={styles.priorityItem}>
        <Text variant="body1" style={styles.priorityIcon}>🟢</Text>
        <Text variant="body1" color="primary" style={styles.priorityLabel}>
          Lav
        </Text>
        <Text variant="subtitle2" color="primary" style={styles.priorityValue}>
          {lowPriority}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // StatCard styles
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },

  // ProgressBar styles
  progressSection: {
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressLabel: {
    marginBottom: 12,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    minWidth: 40,
    textAlign: 'right',
  },

  // CategoryList styles
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryLabel: {
    flex: 1,
  },
  categoryValue: {
    minWidth: 30,
    textAlign: 'right',
    fontWeight: '600',
  },

  // PriorityOverview styles
  priorityContainer: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  priorityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  priorityIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  priorityLabel: {
    flex: 1,
  },
  priorityValue: {
    minWidth: 30,
    textAlign: 'right',
    fontWeight: '600',
  },
});