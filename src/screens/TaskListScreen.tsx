// /src/screens/TaskListScreen.tsx - MODERN 2025 UI/UX! 📱

import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, ActivityIndicator, Alert, Platform, StatusBar, Modal, Dimensions } from 'react-native';
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

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function TaskListScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

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

  // 🎯 Get active filter summary for display
  const getFilterSummary = () => {
    const parts = [];
    
    if (filter !== 'all') {
      parts.push(filter === 'active' ? 'Aktive' : 'Fullført');
    }
    
    if (categoryFilter !== 'all') {
      const categoryInfo = getCategoryInfo(categoryFilter);
      parts.push(categoryInfo.label);
    }
    
    if (searchText.trim()) {
      parts.push(`"${searchText}"`);
    }
    
    if (sortBy !== 'date') {
      parts.push(sortBy === 'priority' ? 'Etter prioritet' : 'Usortert');
    }
    
    return parts.length > 0 ? parts.join(' • ') : 'Alle oppgaver';
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* ✅ PROPER STATUS BAR */}
      <StatusBar 
        barStyle={theme.textPrimary === '#333333' ? 'dark-content' : 'light-content'}
        backgroundColor={theme.background}
        translucent={false}
      />
      
      {/* 📱 MINIMAL HEADER - Clean & Simple */}
      <View style={[styles.headerContainer, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
        <View style={styles.headerRow}>
          <View style={styles.titleSection}>
            <Text variant="h4" color="primary" style={styles.title}>
              Mine oppgaver
            </Text>
            <Text variant="caption" color="secondary" style={styles.subtitle}>
              {filteredTasks.length} av {tasks.length} oppgaver
            </Text>
          </View>
          
          <Button
            variant="info"
            size="small"
            onPress={() => navigation.navigate('Dashboard')}
            style={styles.dashboardButton}
          >
            📊 Dashboard
          </Button>
        </View>
      </View>

      {/* 🎛️ MODERN FILTER BAR - Minimal & Clean */}
      <View style={[styles.filterBar, { backgroundColor: theme.cardBackground, borderBottomColor: theme.border }]}>
        <Button
          variant={filterStats.hasActiveFilters ? 'primary' : 'secondary'}
          size="medium"
          onPress={() => setFilterModalVisible(true)}
          style={styles.filterButton}
        >
          🎛️ Filtre{filterStats.hasActiveFilters ? ' (aktive)' : ''}
        </Button>
        
        {/* Active filter summary */}
        <View style={styles.filterSummary}>
          <Text variant="caption" color="secondary" numberOfLines={1}>
            {getFilterSummary()}
          </Text>
        </View>
        
        {/* Clear filters button */}
        {filterStats.hasActiveFilters && (
          <Button
            variant="secondary"
            size="small"
            onPress={clearFilters}
            style={styles.clearButton}
          >
            ✕ Tøm
          </Button>
        )}
      </View>

      {/* 📋 MAIN TASK LIST - FULL SCREEN REAL ESTATE */}
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
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            showsVerticalScrollIndicator={true}
            removeClippedSubviews={true}
            maxToRenderPerBatch={8}
            windowSize={5}
          />
        )}
      </View>

      {/* ➕ SIMPLE CREATE BUTTON */}
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
      </View>

      {/* 🎛️ FULLSCREEN FILTER MODAL - Modern Pattern */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          {/* Modal Header */}
          <View style={[styles.modalHeader, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
            <Text variant="h4" color="primary" style={styles.modalTitle}>
              🎛️ Filtrer oppgaver
            </Text>
            <Button
              variant="secondary"
              size="medium"
              onPress={() => setFilterModalVisible(false)}
              style={styles.closeButton}
            >
              ✕ Lukk
            </Button>
          </View>

          {/* Filter Content - Full Space */}
          <View style={styles.modalContent}>
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

          {/* Modal Actions */}
          <View style={[styles.modalActions, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
            <Button
              variant="secondary"
              size="large"
              onPress={clearFilters}
              style={styles.clearAllButton}
            >
              🗑️ Tøm alle filtre
            </Button>
            <Button
              variant="primary"
              size="large"
              onPress={() => setFilterModalVisible(false)}
              style={styles.applyButton}
            >
              ✅ Bruk filtre ({filteredTasks.length})
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// 🎨 MODERN 2025 UI STYLES
const styles = StyleSheet.create({
  container: { 
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  
  // MINIMAL HEADER
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
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
    fontSize: 20,
    fontWeight: '600',
  },
  subtitle: {
    marginTop: 2,
  },
  dashboardButton: { 
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  
  // MODERN FILTER BAR
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
  },
  filterSummary: {
    flex: 1,
  },
  clearButton: {
    paddingHorizontal: 12,
  },
  
  // FULL SCREEN LIST
  listContainer: {
    flex: 1, // Takes ALL remaining space
  },
  flatList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  flatListContent: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  
  // LOADING/EMPTY
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  // SIMPLE BUTTON
  createButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'android' ? 20 : 16,
  },
  createButton: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  // FULLSCREEN FILTER MODAL
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    paddingHorizontal: 16,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  clearAllButton: {
    flex: 1,
  },
  applyButton: {
    flex: 2,
  },
});