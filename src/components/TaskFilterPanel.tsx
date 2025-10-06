// /src/components/TaskFilterPanel.tsx
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button } from './Button';
import { Text } from './Text';
import FilterButtons from './FilterButtons';
import { useTheme } from '../core/theme';
import { CATEGORY_OPTIONS } from '../shared/utils/categories';

interface FilterCounts {
  all: number;
  active: number;
  completed: number;
}

interface TaskFilterPanelProps {
  searchText: string;
  onSearchChange: (text: string) => void;
  onSearchClear: () => void;
  
  activeFilter: 'all' | 'active' | 'completed';
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
  filterCounts: FilterCounts;
  
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
  categoryCounts: Record<string, number>;
  
  sortBy: 'date' | 'priority' | 'none';
  onSortChange: (sort: 'date' | 'priority' | 'none') => void;
  
  hasActiveFilters: boolean;
  onClearAll: () => void;
  
  testID?: string;
}

export const TaskFilterPanel: React.FC<TaskFilterPanelProps> = ({
  activeFilter,
  onFilterChange,
  filterCounts,
  categoryFilter,
  onCategoryChange,
  categoryCounts,
  sortBy,
  onSortChange,
  hasActiveFilters,
  onClearAll,
  testID = "task-filter-panel",
}) => {
  const { theme } = useTheme();

  const CategoryButton = ({ category, isActive, onPress, count }: {
    category: { value: string; label: string; color: string };
    isActive: boolean;
    onPress: () => void;
    count: number;
  }) => (
    <Button
      variant={isActive ? 'primary' : 'secondary'}
      size="small"
      onPress={onPress}
      style={[
        styles.categoryButton,
        {
          borderColor: category.color,
          backgroundColor: isActive ? category.color : 'transparent'
        }
      ]}
    >
      {category.label} ({count})
    </Button>
  );

  const SortButton = ({ sort, label, icon }: { 
    sort: typeof sortBy; 
    label: string; 
    icon: string; 
  }) => (
    <Button 
      variant={sortBy === sort ? 'success' : 'secondary'}
      size="small"
      onPress={() => onSortChange(sort)}
    >
      {icon} {label}
    </Button>
  );

  return (
    <View style={styles.container} testID={testID}>
      <FilterButtons
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
        counts={filterCounts}
      />

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="subtitle2" color="primary">Kategori:</Text>
          {hasActiveFilters && (
            <Button
              variant="secondary"
              size="small"
              onPress={onClearAll}
              style={styles.clearButton}
            >
              ✕ Nullstill alle filtre
            </Button>
          )}
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <CategoryButton
            category={{ 
              value: 'all', 
              label: '📋 Alle', 
              color: theme.info 
            }}
            isActive={categoryFilter === 'all'}
            onPress={() => onCategoryChange('all')}
            count={categoryCounts.all || 0}
          />
          {CATEGORY_OPTIONS.map((category) => (
            <CategoryButton
              key={category.value}
              category={category}
              isActive={categoryFilter === category.value}
              onPress={() => onCategoryChange(category.value)}
              count={categoryCounts[category.value] || 0}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text variant="subtitle2" color="primary" style={styles.sectionTitle}>
          Sorter:
        </Text>
        <View style={styles.sortButtons}>
          <SortButton sort="date" label="Dato" icon="📅" />
          <SortButton sort="priority" label="Prioritet" icon="⚡" />
          <SortButton sort="none" label="Standard" icon="📋" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  section: { 
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  clearButton: {
    paddingHorizontal: 12,
  },
  categoryButton: {
    marginRight: 8,
  },
  sectionTitle: { 
    marginBottom: 8,
  },
  sortButtons: { 
    flexDirection: 'row', 
    gap: 8,
  },
});