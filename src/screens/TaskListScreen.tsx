// /src/screens/TaskListScreen.tsx - Fixed imports

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../services/supabase';
import { useTheme } from '../context/ThemeContext';

// 🎯 NEW: Fixed imports for new structure
import ThemeToggle from '../shared/ui/molecules/ThemeToggle';
import TaskCard from '../features/tasks/components/TaskCard';
import SearchBox from '../shared/ui/molecules/SearchBox';
import FilterButtons from '../shared/ui/molecules/FilterButtons';
import { CATEGORY_OPTIONS, getCategoryInfo } from '../shared/utils/categories';

interface Task {
  id: string;
  title: string;
  due_date: string;
  priority: string;
  category?: string;
  status: string;
  user_id: string;
}

export default function TaskListScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'none'>('date');
  const [searchText, setSearchText] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Database operations
  const fetchTasks = async (isRefreshing = false) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true });

      if (error && !isRefreshing) Alert.alert('Feil', 'Kunne ikke hente oppgaver');
      setTasks(data || []);
    } catch (error) {
      if (!isRefreshing) Alert.alert('Feil', 'En uventet feil oppstod');
    } finally {
      isRefreshing ? setRefreshing(false) : setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);
      if (error) throw error;
      setSelectedTaskId(null);
      await fetchTasks();
    } catch (error: any) {
      Alert.alert('Feil', 'Kunne ikke slette oppgave: ' + error.message);
    }
  };

  // Task actions
  const handleTaskPress = (taskId: string) => {
    setSelectedTaskId(selectedTaskId === taskId ? null : taskId);
  };

  const handleTaskEdit = (taskId: string) => {
    setSelectedTaskId(null);
    navigation.navigate('TaskDetail', { taskId });
  };

  const handleTaskDelete = (taskId: string, taskTitle: string) => {
    if (confirm(`Er du sikker på at du vil slette "${taskTitle}"?`)) {
      handleDeleteTask(taskId);
    } else {
      setSelectedTaskId(null);
    }
  };

  // Lifecycle
  useEffect(() => { fetchTasks(); }, []);
  useFocusEffect(useCallback(() => { setSelectedTaskId(null); fetchTasks(); }, []));

  const onRefresh = () => {
    setRefreshing(true);
    setSelectedTaskId(null);
    fetchTasks(true);
  };

  // Filter and sort
  const getFilteredTasks = () => {
    return tasks
      .filter(task => {
        if (filter === 'active' && task.status !== 'open') return false;
        if (filter === 'completed' && task.status !== 'completed') return false;
        if (categoryFilter !== 'all' && (task.category || 'Personlig') !== categoryFilter) return false;
        if (searchText.trim() && !task.title.toLowerCase().includes(searchText.toLowerCase().trim())) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priority') {
          const order = { 'High': 3, 'Medium': 2, 'Low': 1 };
          return (order[b.priority as keyof typeof order] || 0) - (order[a.priority as keyof typeof order] || 0);
        }
        if (sortBy === 'date') {
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        }
        return 0;
      });
  };

  const filteredTasks = getFilteredTasks();
  
  const filterCounts = {
    all: tasks.length,
    active: tasks.filter(t => t.status === 'open').length,
    completed: tasks.filter(t => t.status === 'completed').length
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Mine oppgaver</Text>
        <ThemeToggle />
      </View>

      {/* Dashboard */}
      <TouchableOpacity 
        style={[styles.dashboardButton, { backgroundColor: '#2196F3' }]}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Text style={styles.dashboardText}>📊 Dashboard</Text>
      </TouchableOpacity>

      {/* Search */}
      <SearchBox 
        value={searchText}
        onChangeText={setSearchText}
        placeholder="🔍 Søk etter oppgaver..."
      />

      {/* Status Filters */}
      <FilterButtons
        activeFilter={filter}
        onFilterChange={setFilter}
        counts={filterCounts}
      />

      {/* Content */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.info} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Laster oppgaver...</Text>
        </View>
      ) : filteredTasks.length === 0 ? (
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          {searchText.trim() ? `Ingen oppgaver funnet for "${searchText}"` : 'Ingen oppgaver ennå'}
        </Text>
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
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.info]} tintColor={theme.info} />
          }
          onScrollBeginDrag={() => setSelectedTaskId(null)}
        />
      )}

      {/* Create Button */}
      <TouchableOpacity 
        style={[styles.createButton, { backgroundColor: theme.info }]}
        onPress={() => navigation.navigate('CreateTask')}
      >
        <Text style={styles.createText}>+ Opprett ny oppgave</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', flex: 1 },
  dashboardButton: { padding: 12, borderRadius: 8, alignItems: 'center', elevation: 3, marginBottom: 20 },
  dashboardText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 },
  loadingText: { textAlign: 'center', fontSize: 16, marginTop: 10 },
  emptyText: { textAlign: 'center', fontSize: 16, marginTop: 50 },
  list: { flex: 1 },
  createButton: { padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  createText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});