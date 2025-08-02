// /src/screens/TaskListScreen.tsx - REAL MOBILE OPTIMIZED! 📱

import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, ActivityIndicator, Alert, Platform, StatusBar, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

// 🎯 Modern imports - SUPER Clean!
import { useTasks, useTaskFilters } from '../features/tasks';
import TaskCard from '../features/tasks/components/TaskCard';

// 🎨 UI organisms - Big reusable blocks!
import { TaskFilterPanel } from '../shared/ui/organisms/TaskFilterPanel';
import { EmptyState } from '../shared/ui/organisms/EmptyState';
import { Header } from '../shared/ui/organisms/Header';
import { Button, Text } from '../shared/ui';

// 🌐 Context & Utils
import { useTheme } from '../context/ThemeContext';
import { getCategoryInfo } from '../shared/utils/categories';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export default function TaskListScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);

  // 🎯 POWER OF HOOKS! Business logic in 2 lines!
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

  // 🎯 Event handlers - Super clean!
  const handleTaskPress = (taskId: string) => {
    setSelectedTaskId(selectedTaskId === taskId ? null : taskId);
  };

  const handleTaskEdit = (taskId: string) => {
    setSelectedTaskId(null);
    navigation.navigate('TaskDetail', { taskId });
  };

  // ✅ React Native compatible Alert
  const handleTaskDelete = async (taskId: string, taskTitle: string) => {
    Alert.alert(
      'Slett oppgave', 
      `Er du sikker på at du vil slette "${taskTitle}"?`,
      [
        {
          text: 'Avbryt',
          style: 'cancel',
          onPress: () => setSelectedTaskId(null)
        },
        {
          text: 'Slett',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteTask(taskId); 
            if (success) {
              setSelectedTaskId(null); 
            }
          }
        }
      ]
    );
  };

  const handleRefresh = () => {
    setSelectedTaskId(null);
    refresh();
  };

  // 📊 Get category counts for filter panel
  const getCategoryCounts = () => {
    const counts: Record<string, number> = {
      all: tasks.length,
    };
    
    tasks.forEach(task => {
      const category = task.category || 'Personlig';
      counts[category] = (counts[category] || 0) + 1;
    });
    
    return counts;
  };

  // 📊 Get empty state message and props
  const getEmptyStateProps = () => {
    if (searchText.trim()) {
      return {
        variant: 'search' as const,
        title: 'Ingen resultater',
        description: `Fant ingen oppgaver som matcher "${searchText}"`,
        actionLabel: 'Tøm søkefeltet',
        onAction: () => setSearchText(''),
      };
    }
    
    if (categoryFilter !== 'all') {
      const categoryInfo = getCategoryInfo(categoryFilter);
      return {
        variant: 'filter' as const,
        title: 'Ingen oppgaver i denne kategorien',
        description: `Du har ingen oppgaver i kategorien "${categoryInfo.label}"`,
        actionLabel: 'Vis alle kategorier',
        onAction: () => setCategoryFilter('all'),
      };
    }
    
    if (filter === 'active') {
      return {
        title: 'Alle oppgaver fullført! 🎉',
        description: 'Du har ingen aktive oppgaver akkurat nå.',
        actionLabel: 'Opprett ny oppgave',
        onAction: () => navigation.navigate('CreateTask'),
      };
    }
    
    if (filter === 'completed') {
      return {
        title: 'Ingen fullførte oppgaver ennå',
        description: 'Fullfør noen oppgaver for å se dem her.',
        actionLabel: 'Vis aktive oppgaver',
        onAction: () => setFilter('active'),
      };
    }
    
    // No tasks at all
    return {
      title: 'Velkommen til TaskMaster Pro!',
      description: 'Du har ingen oppgaver ennå. Opprett din første oppgave for å komme i gang.',
      actionLabel: '➕ Opprett din første oppgave',
      onAction: () => navigation.navigate('CreateTask'),
    };
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* ✅ PROPER STATUS BAR - Critical for real mobile */}
      <StatusBar 
        barStyle={theme.textPrimary === '#333333' ? 'dark-content' : 'light-content'}
        backgroundColor={theme.background}
        translucent={false}
      />
      
      {/* 📱 ULTRA-COMPACT HEADER - Minimal space usage */}
      <View style={[styles.headerContainer, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
        <View style={styles.headerRow}>
          <View style={styles.titleSection}>
            <Text variant="h4" color="primary" style={styles.title}>
              Mine oppgaver ({tasks.length})
            </Text>
          </View>
          
          <Button
            variant="info"
            size="small"
            onPress={() => navigation.navigate('Dashboard')}
            style={styles.dashboardButton}
          >
            📊
          </Button>
        </View>
      </View>

      {/* 🎛️ COLLAPSIBLE FILTERS - Save vertical space */}
      <View style={[styles.filtersHeader, { backgroundColor: theme.cardBackground, borderBottomColor: theme.border }]}>
        <Button
          variant="secondary"
          size="small"
          onPress={() => setFiltersCollapsed(!filtersCollapsed)}
          style={styles.toggleFiltersButton}
        >
          {filtersCollapsed ? '🔽 Vis filtre' : '🔼 Skjul filtre'} ({filteredTasks.length} av {tasks.length})
        </Button>
      </View>

      {!filtersCollapsed && (
        <View style={[styles.filtersContainer, { backgroundColor: theme.cardBackground, borderBottomColor: theme.border }]}>
          <TaskFilterPanel
            searchText={searchText}
            onSearchChange={setSearchText}
            onSearchClear={() => setSearchText('')}
            activeFilter={filter}
            onFilterChange={setFilter}
            filterCounts={taskCounts}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            categoryCounts={getCategoryCounts()}
            sortBy={sortBy}
            onSortChange={setSortBy}
            hasActiveFilters={filterStats.hasActiveFilters}
            onClearAll={clearFilters}
          />
        </View>
      )}

      {/* 📋 MAIN TASK LIST - Maximum available space */}
      <View style={styles.listContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text variant="body1" color="secondary" style={styles.loadingText}>
              Laster oppgaver...
            </Text>
          </View>
        ) : filteredTasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <EmptyState {...getEmptyStateProps()} />
          </View>
        ) : (
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
            style={styles.flatList}
            contentContainerStyle={styles.flatListContent}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={handleRefresh} 
                colors={['#007AFF']} 
                tintColor="#007AFF" 
              />
            }
            onScrollBeginDrag={() => setSelectedTaskId(null)}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            showsVerticalScrollIndicator={true}
            removeClippedSubviews={true}
            maxToRenderPerBatch={8}
            windowSize={5}
            getItemLayout={(data, index) => ({
              length: 120, // Approximate TaskCard height
              offset: 128 * index, // 120 + 8 separator
              index,
            })}
          />
        )}
      </View>

      {/* ➕ HUAWEI-SAFE CREATE BUTTON - Well above virtual navbar */}
      <View style={[styles.createButtonContainer, { backgroundColor: theme.background }]}>
        <Button
          variant="primary"
          size="large"
          fullWidth
          onPress={() => navigation.navigate('CreateTask')}
          style={styles.createButton}
        >
          ➕ Opprett ny oppgave
        </Button>
        
        {/* 📱 EXTRA SAFE AREA for Huawei virtual buttons */}
        <View style={styles.huaweiSafeArea} />
      </View>
    </View>
  );
}

// 🎨 REAL MOBILE OPTIMIZED STYLES
const styles = StyleSheet.create({
  container: { 
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  
  // ULTRA-COMPACT HEADER
  headerContainer: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  dashboardButton: { 
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  
  // COLLAPSIBLE FILTERS
  filtersHeader: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  toggleFiltersButton: {
    alignSelf: 'flex-start',
  },
  filtersContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    maxHeight: SCREEN_HEIGHT * 0.4, // Max 40% of screen
  },
  
  // MAIN LIST - Takes ALL remaining space
  listContainer: {
    flex: 1, // Critical: Takes all available space
    backgroundColor: 'transparent',
  },
  flatList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  flatListContent: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  
  // LOADING/EMPTY
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  // HUAWEI-SAFE BUTTON
  createButtonContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  createButton: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  huaweiSafeArea: {
    height: Platform.OS === 'android' ? 15 : 0, // Extra space for Huawei virtual navbar
  },
});