// /src/components/FilterButtons.tsx - Modulære filter-knapper

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

interface FilterButtonsProps {
  activeFilter: 'all' | 'active' | 'completed';
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
  counts: {
    all: number;
    active: number;
    completed: number;
  };
}

export default function FilterButtons({ activeFilter, onFilterChange, counts }: FilterButtonsProps) {
  const { theme } = useTheme();

  const FilterButton = ({ 
    filter, 
    label, 
    count 
  }: { 
    filter: 'all' | 'active' | 'completed'; 
    label: string; 
    count: number; 
  }) => {
    const isActive = activeFilter === filter;
    
    return (
      <TouchableOpacity
        style={[
          styles.button, 
          { 
            backgroundColor: isActive ? theme.info : theme.cardBackground,
            borderColor: theme.border 
          }
        ]}
        onPress={() => onFilterChange(filter)}
      >
        <Text style={[
          styles.text, 
          { color: isActive ? '#fff' : theme.textSecondary }
        ]}>
          {label} ({count})
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FilterButton filter="all" label="Alle" count={counts.all} />
      <FilterButton filter="active" label="Aktive" count={counts.active} />
      <FilterButton filter="completed" label="Fullført" count={counts.completed} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
});