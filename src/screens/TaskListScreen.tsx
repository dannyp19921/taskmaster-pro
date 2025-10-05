// /src/screens/TaskListScreen.tsx
import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, ActivityIndicator, Alert, Platform, StatusBar, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../services/supabase';

import { useTasks, useTaskFilters } from '../features/tasks';
import TaskCard from '../features/tasks/components/TaskCard';

import { TaskFilterPanel } from '../components/TaskFilterPanel';
import { EmptyState } from '../components/EmptyState';
import SearchBox from '../components/SearchBox';
import { Button } from '../components/Button';
import { Text } from '../components/Text';

import { useTheme } from '../context/ThemeContext';
import { getCategoryInfo } from '../shared/utils/categories';

export default function TaskListScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

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

  useFocusEffect(useCallback(() => {
    setSelectedTaskId(null);
  }, []));

  const handleTaskPress = (taskId: string) => {
    setSelectedTaskId(selectedTaskId === taskId ? null : taskId);
  };

  const handleTaskEdit = (taskId: string) => {
    setSelectedTaskId(null);
    navigation.navigate('TaskDetail', { taskId });
  };

  const handleTaskDelete = async (taskId: string, taskTitle: string) => {
    // Use window.confirm for web, Alert for native
    const confirmDelete = Platform.OS === 'web' 
      ? window.confirm(`Er du sikker på at du vil slette "${taskTitle}"?`)
      : await new Promise<boolean>((resolve) => {
          Alert.alert(
            'Slett oppgave',
            `Er du sikker på at du vil slette "${taskTitle}"?`,
            [
              { text: 'Avbryt', style: 'cancel', onPress: () => resolve(false) },
              { text: 'Slett', style: 'destructive', onPress: () => resolve(true) }
            ]
          );
        });

    if (confirmDelete) {
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
        title: 'Alle oppgaver fullført!',
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
    
    return {
      title: 'Velkommen til TaskMaster Pro!',
      description: 'Du har ingen oppgaver ennå. Opprett din første oppgave for å komme i gang.',
      actionLabel: 'Opprett din første oppgave',
      onAction: () => navigation.navigate('CreateTask'),
    };
  };

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
      <StatusBar 
        barStyle={theme.textPrimary === '#333333' ? 'dark-content' : 'light-content'}
        backgroundColor={theme.background}
        translucent={false}
      />
      
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
          
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button
              variant="info"
              size="small"
              onPress={() => navigation.navigate('Dashboard')}
              style={styles.dashboardButton}
            >
              Dashboard
            </Button>
            
            <Button
              variant="secondary"
              size="small"
              onPress={async () => {
                await supabase.auth.signOut();
              }}
              style={styles.dashboardButton}
            >
              Logg ut
            </Button>
          </View>
        </View>
      </View>

      {/* Filter and Search Bar */}
      <View style={[styles.filterBar, { backgroundColor: theme.cardBackground, borderBottomColor: theme.border }]}>
        <View style={styles.searchContainer}>
          <SearchBox
            value={searchText}
            onChangeText={setSearchText}
            onClear={() => setSearchText('')}
            placeholder="Søk i oppgaver..."
          />
        </View>
        
        <Button
          variant={filterStats.hasActiveFilters ? 'primary' : 'secondary'}
          size="medium"
          onPress={() => setFilterModalVisible(true)}
          style={styles.filterButton}
        >
          Filtre{filterStats.hasActiveFilters ? ' (aktive)' : ''}
        </Button>
        
        {filterStats.hasActiveFilters && (
          <Button
            variant="secondary"
            size="small"
            onPress={clearFilters}
            style={styles.clearButton}
          >
            Tøm
          </Button>
        )}
      </View>

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

      <View style={[styles.createButtonContainer, { backgroundColor: theme.background }]}>
        <Button
          variant="primary"
          size="large"
          fullWidth
          onPress={() => navigation.navigate('CreateTask')}
          style={styles.createButton}
        >
          Opprett ny oppgave
        </Button>
      </View>

      <Modal
        visible={filterModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
            <Text variant="h4" color="primary" style={styles.modalTitle}>
              Filtrer oppgaver
            </Text>
            <Button
              variant="secondary"
              size="medium"
              onPress={() => setFilterModalVisible(false)}
              style={styles.closeButton}
            >
              Lukk
            </Button>
          </View>

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

          <View style={[styles.modalActions, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
            <Button
              variant="secondary"
              size="large"
              onPress={clearFilters}
              style={styles.clearAllButton}
            >
              Tøm alle filtre
            </Button>
            <Button
              variant="primary"
              size="large"
              onPress={() => setFilterModalVisible(false)}
              style={styles.applyButton}
            >
              Bruk filtre ({filteredTasks.length})
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
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
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 8,
  },
  searchContainer: {
    flex: 1,
  },
  filterButton: {
    paddingHorizontal: 12,
  },
  clearButton: {
    paddingHorizontal: 12,
  },
  listContainer: {
    flex: 1,
  },
  flatList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  flatListContent: {
    paddingTop: 16,
    paddingBottom: 16,
  },
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