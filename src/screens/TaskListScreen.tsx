// /src/screens/TaskListScreen.tsx - FIKSET: Enhanced with modern loading states! 

import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

// 🎯 Modern imports - SUPER Clean!
import { useTasks, useTaskFilters } from '../features/tasks';
import TaskCard from '../features/tasks/components/TaskCard';

// 🎨 UI organisms - Big reusable blocks!
import { TaskFilterPanel } from '../shared/ui/organisms/TaskFilterPanel';
import { EmptyState } from '../shared/ui/organisms/EmptyState';
import { Header } from '../shared/ui/organisms/Header';
import { Button, Text } from '../shared/ui'; // 🔧 FIKSET: Lagt til Text import

// 🌐 Context & Utils
import { useTheme } from '../context/ThemeContext';
import { getCategoryInfo } from '../shared/utils/categories';

export default function TaskListScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

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

  // This block should now be React Native compatible (as to not crash on mobile):
  const handleTaskDelete = async (taskId: string, taskTitle: string) => {
    Alert.alert(
      'Slett oppgave', 
      'Er du sikker på at du vil slette "${taskTitle}"?',
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
    )
  }

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
      {/* 📱 Header - Clean organism! */}
      <Header 
        title="Mine oppgaver"
        subtitle={`${tasks.length} oppgaver totalt`}
      />

      {/* 📊 Dashboard Navigation */}
      <Button
        variant="info"
        size="medium"
        fullWidth
        icon="📊"
        onPress={() => navigation.navigate('Dashboard')}
        style={styles.dashboardButton}
      >
        Dashboard
      </Button>

      {/* 🎛️ Complete Filter Panel - One organism! */}
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

      {/* 📋 Content with Enhanced Loading States */}
      {loading ? (
        // 🔄 FIKSET: Proper loading state with styling
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.info} />
          <Text variant="body1" color="secondary" style={styles.loadingText}>
            Laster oppgaver...
          </Text>
        </View>
      ) : filteredTasks.length === 0 ? (
        <EmptyState {...getEmptyStateProps()} />
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
      )}

      {/* ➕ Create Button */}
      <Button
        variant="primary"
        size="large"
        fullWidth
        icon="+"
        onPress={() => navigation.navigate('CreateTask')}
        style={styles.createButton}
      >
        Opprett ny oppgave
      </Button>
    </View>
  );
}

// 🎨 MUCH CLEANER STYLES! 
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20,
  },
  dashboardButton: { 
    marginBottom: 20,
  },
  list: { 
    flex: 1,
  },
  createButton: { 
    marginTop: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  // 🔧 FIKSET: Lagt til manglende loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
});