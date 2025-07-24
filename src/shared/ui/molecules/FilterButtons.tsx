// /src/shared/ui/molecules/FilterButtons.tsx - Refaktorert med atomiske komponenter
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';

export type FilterType = 'all' | 'active' | 'completed';

interface FilterCounts {
  all: number;
  active: number;
  completed: number;
}

interface FilterButtonsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: FilterCounts;
  testID?: string;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({
  activeFilter,
  onFilterChange,
  counts,
  testID = "filter-buttons",
}) => {
  const filterOptions: Array<{
    key: FilterType;
    label: string;
    icon: string;
    count: number;
  }> = [
    { key: 'all', label: 'Alle', icon: '📋', count: counts.all },
    { key: 'active', label: 'Aktive', icon: '⏳', count: counts.active },
    { key: 'completed', label: 'Fullført', icon: '✅', count: counts.completed },
  ];

  return (
    <View style={styles.container} testID={testID}>
      <Text variant="subtitle2" color="secondary" style={styles.title}>
        Status:
      </Text>
      
      <View style={styles.buttonContainer}>
        {filterOptions.map(({ key, label, icon, count }) => (
          <Button
            key={key}
            variant={activeFilter === key ? 'primary' : 'secondary'}
            size="small"
            onPress={() => onFilterChange(key)}
            style={styles.filterButton}
            testID={`filter-${key}`}
          >
            {icon} {label} ({count})
          </Button>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  title: {
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flex: 1,
  },
});

export default FilterButtons;