// /src/screens/TaskListScreen.tsx - Fixed styles version

import React, { useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

// 🎯 Modern imports - Clean!
import { useTasks, useTaskFilters } from '../features/tasks';
import TaskCard from '../features/tasks/components/TaskCard';

// 🔄 UI components - gradually using atoms
import { Button, Text } from '../shared/ui';
import SearchBox from '../shared/ui/molecules/SearchBox';
import FilterButtons from '../shared/ui/molecules/FilterButtons';
import ThemeToggle from '../shared/ui/molecules/ThemeToggle';

// 🌐 Context & Utils
import { useTheme } from '../context/ThemeContext';
import { CATEGORY_OPTIONS, getCategoryInfo } from '../shared/utils/categories';

export default function TaskListScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // 🎯 POWER OF HOOKS! Business logic i 2 linjer!
  const {
    tasks,
    loading,
    refreshing,
    deleteTask,
    refresh,
    taskCounts,
  } = useTasks();

  const {
    filteredTasks,
    searchText,
    setSearchText,
    filter,
    setFilter,
    categoryFilter,
    setCategoryFilter,
    sortBy,
    setSortBy,
    clearFilters,
    filterStats,
  } = useTaskFilters(tasks);

  // 🔄 Lifecycle
  useFocusEffect(useCallback(() => {
    setSelectedTaskId(null);
  }, []));

  // 🎯 Event handlers
  const handleTaskPress = (taskId: string) => {
    setSelectedTaskId(selectedTaskId === taskId ? null : taskId);
  };

  const handleTaskEdit = (taskId: string) => {
    setSelectedTaskId(null);
    navigation.navigate('TaskDetail', { taskId });
  };

  const handleTaskDelete = async (taskId: string, taskTitle: string) => {
    if (confirm(`Er du sikker på at du vil slette "${taskTitle}"?`)) {
      const success = await deleteTask(taskId);
      if (success) {
        setSelectedTaskId(null);
      }
    } else {
      setSelectedTaskId(null);
    }
  };

  const handleRefresh = () => {
    setSelectedTaskId(null);
    refresh();
  };

  // 🎨 Category Button - FIXED styling
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
      style={{
        marginRight: 8,
        borderColor: category.color,
        backgroundColor: isActive ? category.color : 'transparent'
      }}
    >
      {category.label} ({count})
    </Button>
  );

  // 📊 Empty state message
  const getEmptyMessage = () => {
    if (searchText.trim()) {
      return `Ingen oppgaver funnet for "${searchText}"`;
    }
    if (categoryFilter !== 'all') {
      return `Ingen oppgaver i kategorien "${getCategoryInfo(categoryFilter).label}"`;
    }
    if (filter === 'active') return 'Ingen aktive oppgaver';
    if (filter === 'completed') return 'Ingen fullførte oppgaver';
    return 'Ingen oppgaver ennå';
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* 📱 Header */}
      <View style={styles.header}>
        <Text variant="h3" color="primary">Mine oppgaver</Text>
        <ThemeToggle />
      </View>

      {/* 📊 Dashboard Navigation */}
      <TouchableOpacity 
        style={[styles.dashboardButton, { backgroundColor: theme.info }]}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Text variant="button" color="#FFFFFF">📊 Dashboard</Text>
      </TouchableOpacity>

      {/* 🔍 Search */}
      <SearchBox 
        value={searchText}
        onChangeText={setSearchText}
        placeholder="🔍 Søk etter oppgaver..."
        onClear={() => setSearchText('')}
      />

      {/* 🎛️ Status Filters */}
      <FilterButtons
        activeFilter={filter}
        onFilterChange={setFilter}
        counts={taskCounts}
      />

      {/* 🏷️ Category Filters */}
      <View style={styles.categorySection}>
        <View style={styles.sectionHeader}>
          <Text variant="subtitle2" color="primary">Kategori:</Text>
          {filterStats.hasActiveFilters && (
            <Button
              variant="secondary"
              size="small"
              onPress={clearFilters}
              style={styles.clearButton}
            >
              ✕ Nullstill
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
            onPress={() => setCategoryFilter('all')}
            count={tasks.length}
          />
          {CATEGORY_OPTIONS.map((category) => (
            <CategoryButton
              key={category.value}
              category={category}
              isActive={categoryFilter === category.value}
              onPress={() => setCategoryFilter(category.value)}
              count={tasks.filter(t => (t.category || 'Personlig') === category.value).length}
            />
          ))}
        </ScrollView>
      </View>

      {/* 🔀 Sort Options */}
      <View style={styles.sortSection}>
        <Text variant="subtitle2" color="primary" style={styles.sectionTitle}>
          Sorter:
        </Text>
        <View style={styles.sortButtons}>
          <Button 
            variant={sortBy === 'date' ? 'success' : 'secondary'}
            size="small"
            onPress={() => setSortBy('date')}
          >
            📅 Dato
          </Button>
          <Button 
            variant={sortBy === 'priority' ? 'success' : 'secondary'}
            size="small"
            onPress={() => setSortBy('priority')}
          >
            ⚡ Prioritet
          </Button>
          <Button 
            variant={sortBy === 'none' ? 'success' : 'secondary'}
            size="small"
            onPress={() => setSortBy('none')}
          >
            📝 Standard
          </Button>
        </View>
      </View>

      {/* 📋 Content */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.info} />
          <Text variant="body2" color="secondary" style={styles.loadingText}>
            Laster oppgaver...
          </Text>
        </View>
      ) : filteredTasks.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text variant="h1" style={styles.emptyIcon}>
            📝
          </Text>
          <Text variant="body1" color="secondary" align="center">
            {getEmptyMessage()}
          </Text>
          {tasks.length === 0 && (
            <Button
              variant="primary"
              size="medium"
              onPress={() => navigation.navigate('CreateTask')}
              style={styles.emptyActionButton}
            >
              ➕ Opprett din første oppgave
            </Button>
          )}
        </View>
      ) : (
        <>
          {filterStats.hasActiveFilters && (
            <View style={styles.statsContainer}>
              <Text variant="caption" color="secondary">
                Viser {filteredTasks.length} av {tasks.length} oppgaver
              </Text>
            </View>
          )}
          
          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TaskCard
                task={item}
                isSelected={selectedTaskId === item.id}
                onPress={() => handleTaskPress(item.id)}
                onEdit={() => handleTaskEdit(item.id)}
                onDelete={() => handleTaskDelete(item.id, item.title)}
              />
            )}
            style={styles.list}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={handleRefresh} 
                colors={[theme.info]} 
                tintColor={theme.info} 
              />
            }
            onScrollBeginDrag={() => setSelectedTaskId(null)}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}

      {/* ➕ Create Button */}
      <TouchableOpacity 
        style={[styles.createButton, { backgroundColor: theme.info }]}
        onPress={() => navigation.navigate('CreateTask')}
      >
        <Text variant="button" color="#FFFFFF">+ Opprett ny oppgave</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20,
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20,
  },
  dashboardButton: { 
    padding: 12, 
    borderRadius: 8, 
    alignItems: 'center', 
    elevation: 3, 
    marginBottom: 20,
  },
  categorySection: { 
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
  sectionTitle: { 
    marginBottom: 8,
  },
  sortSection: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 15,
  },
  sortButtons: { 
    flexDirection: 'row', 
    gap: 8, 
    marginLeft: 8,
  },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingTop: 50,
  },
  loadingText: { 
    marginTop: 10,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyActionButton: {
    marginTop: 24,
    minWidth: 200,
  },
  statsContainer: {
    paddingHorizontal: 4,
    paddingVertical: 8,
    marginBottom: 8,
  },
  list: { 
    flex: 1,
    marginTop: 8,
  },
  createButton: { 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});