// /src/screens/TaskListScreen.tsx - Med dark mode support (ren versjon)

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, TextInput, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../services/supabase';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

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
  const { theme, isDarkMode } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'none'>('date');
  const [searchText, setSearchText] = useState('');
  const [swipedItemId, setSwipedItemId] = useState<string | null>(null);

  const categoryOptions = [
    { value: 'Arbeid', label: '💼 Arbeid', color: '#007AFF' },
    { value: 'Personlig', label: '👤 Personlig', color: '#4CAF50' },
    { value: 'Helse', label: '🏃‍♂️ Helse', color: '#FF9800' },
    { value: 'Økonomi', label: '💰 Økonomi', color: '#9C27B0' },
    { value: 'Utdanning', label: '📚 Utdanning', color: '#2196F3' },
    { value: 'Familie', label: '👨‍👩‍👧‍👦 Familie', color: '#E91E63' },
    { value: 'Hobby', label: '🎨 Hobby', color: '#FF5722' },
    { value: 'Annet', label: '📝 Annet', color: '#607D8B' }
  ];

  const getCategoryInfo = (categoryValue?: string) => {
    if (!categoryValue) {
      return categoryOptions[1];
    }
    return categoryOptions.find(cat => cat.value === categoryValue) || categoryOptions[1];
  };

  const fetchTasks = async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        console.log('🔄 Refresher oppgaver...');
      } else {
        console.log('📡 Henter oppgaver...');
      }
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.log('🚫 Ikke innlogget:', userError?.message);
        return;
      }

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true });

      if (error) {
        console.log('❌ Feil ved henting:', error.message);
        if (!isRefreshing) {
          Alert.alert('Feil', 'Kunne ikke hente oppgaver');
        }
        return;
      }

      console.log('✅ Oppgaver hentet:', data?.length || 0);
      setTasks(data || []);
    } catch (error) {
      console.log('💥 Uventet feil:', error);
      if (!isRefreshing) {
        Alert.alert('Feil', 'En uventet feil oppstod');
      }
    } finally {
      if (isRefreshing) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    console.log('🧨 HANDLEDELETETASK STARTET - taskId:', taskId);

    try {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);

      if (error) {
        console.log('❌ Slettesvikt:', error.message);
        Alert.alert('Feil', 'Kunne ikke slette oppgave: ' + error.message);
        return;
      }

      console.log('✅ Slettesuksess! Henter oppgaver på nytt...');
      setSwipedItemId(null);
      await fetchTasks();
    } catch (err) {
      console.log('💥 Uventet feil i handleDeleteTask:', err);
    }
  };

  const confirmDelete = (taskId: string, taskTitle: string) => {
    console.log('🟠 Trykket slett med bekreftelse på:', taskId);
    
    const shouldDelete = confirm(`Er du sikker på at du vil slette "${taskTitle}"?`);
    
    if (shouldDelete) {
      console.log('🟢 BEKREFTELSE GODKJENT - taskId:', taskId);
      handleDeleteTask(taskId);
    } else {
      console.log('❌ BEKREFTELSE AVBRUTT');
      setSwipedItemId(null);
    }
  };

  const openTask = (taskId: string) => {
    setSwipedItemId(null);
    navigation.navigate('TaskDetail', { taskId });
  };

  const onRefresh = () => {
    setRefreshing(true);
    setSwipedItemId(null);
    fetchTasks(true);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.log('🔄 TaskListScreen kom i fokus - oppdaterer oppgaver');
      setSwipedItemId(null);
      fetchTasks();
    }, [])
  );

  const getDeadlineStatus = (dueDate: string) => {
    const today = new Date();
    const deadline = new Date(dueDate);
    
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);
    
    const timeDiff = deadline.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff < 0) {
      return { status: 'overdue', days: Math.abs(daysDiff), color: theme.overdue, badge: 'UTLØPT' };
    } else if (daysDiff === 0) {
      return { status: 'today', days: 0, color: theme.today, badge: 'I DAG!' };
    } else if (daysDiff === 1) {
      return { status: 'tomorrow', days: 1, color: theme.warning, badge: 'I MORGEN' };
    } else if (daysDiff <= 3) {
      return { status: 'soon', days: daysDiff, color: theme.soon, badge: `${daysDiff} DAGER` };
    } else if (daysDiff <= 7) {
      return { status: 'week', days: daysDiff, color: theme.success, badge: `${daysDiff} DAGER` };
    } else {
      return { status: 'normal', days: daysDiff, color: theme.textTertiary, badge: null };
    }
  };

  const getFilteredSearchedAndSortedTasks = () => {
    let filteredTasks = tasks;
    switch (filter) {
      case 'active':
        filteredTasks = tasks.filter(task => task.status === 'open');
        break;
      case 'completed':
        filteredTasks = tasks.filter(task => task.status === 'completed');
        break;
      default:
        filteredTasks = tasks;
    }

    if (categoryFilter !== 'all') {
      filteredTasks = filteredTasks.filter(task => {
        const taskCategory = task.category || 'Personlig';
        return taskCategory === categoryFilter;
      });
    }

    if (searchText.trim()) {
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(searchText.toLowerCase().trim())
      );
    }

    switch (sortBy) {
      case 'priority':
        return filteredTasks.sort((a, b) => {
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          return bPriority - aPriority;
        });
      case 'date':
        return filteredTasks.sort((a, b) => {
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        });
      default:
        return filteredTasks;
    }
  };

  const renderTask = ({ item }: { item: Task }) => {
    const deadlineInfo = getDeadlineStatus(item.due_date);
    const isCompleted = item.status === 'completed';
    const categoryInfo = getCategoryInfo(item.category);
    const isItemSwiped = swipedItemId === item.id;
    
    return (
      <View style={styles.taskItemContainer}>
        {isItemSwiped && (
          <View style={[styles.deleteBackground, { backgroundColor: theme.error }]}>
            <Text style={styles.deleteBackgroundIcon}>🗑️</Text>
            <Text style={styles.deleteBackgroundText}>Slett</Text>
          </View>
        )}
        
        <View style={[
          styles.taskCard,
          { backgroundColor: theme.cardBackground },
          isCompleted && { opacity: 0.7 },
          !isCompleted && { borderLeftWidth: 4, borderLeftColor: deadlineInfo.color },
          isItemSwiped && styles.taskCardSwiped
        ]}>
          <TouchableOpacity 
            onPress={() => {
              if (isItemSwiped) {
                setSwipedItemId(null);
              } else {
                setSwipedItemId(item.id);
              }
            }}
            style={styles.taskContent}
          >
            <View style={styles.taskHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Text style={[
                  styles.taskTitle,
                  { color: theme.textPrimary },
                  isCompleted && { 
                    textDecorationLine: 'line-through', 
                    color: theme.textTertiary 
                  }
                ]}>
                  {item.title}
                </Text>
                {isCompleted && (
                  <Text style={{ 
                    marginLeft: 10, 
                    color: theme.completed, 
                    fontSize: 16, 
                    fontWeight: 'bold' 
                  }}>
                    ✓
                  </Text>
                )}
                {!isCompleted && deadlineInfo.badge && (
                  <View style={[
                    styles.deadlineBadge, 
                    { backgroundColor: deadlineInfo.color }
                  ]}>
                    <Text style={styles.deadlineBadgeText}>
                      {deadlineInfo.badge}
                    </Text>
                  </View>
                )}
              </View>
              
              <View style={[
                styles.swipeIndicator, 
                { backgroundColor: isDarkMode ? '#4a4a4a' : '#f0f0f0' }
              ]}>
                <Text style={[
                  styles.swipeIndicatorText,
                  { color: theme.textTertiary },
                  isItemSwiped && { color: theme.error }
                ]}>
                  {isItemSwiped ? '✕' : '⋯'}
                </Text>
              </View>
            </View>
            
            <View style={styles.categoryContainer}>
              <View style={[styles.categoryBadge, { backgroundColor: categoryInfo.color }]}>
                <Text style={styles.categoryBadgeText}>
                  {categoryInfo.label}
                </Text>
              </View>
            </View>
            
            <Text style={[styles.taskDetail, { color: theme.textSecondary }]}>
              Frist: {item.due_date}
            </Text>
            <Text style={[styles.taskDetail, { color: theme.textSecondary }]}>
              Prioritet: {item.priority}
            </Text>
            <Text style={[
              styles.taskDetail,
              { color: isCompleted ? theme.completed : theme.warning }
            ]}>
              Status: {isCompleted ? 'Fullført' : 'Aktiv'}
            </Text>
            
            {!isCompleted && (
              <Text style={[styles.taskDetail, { color: deadlineInfo.color, fontWeight: '600' }]}>
                {deadlineInfo.status === 'overdue' && `Utløpt for ${deadlineInfo.days} dag${deadlineInfo.days > 1 ? 'er' : ''} siden`}
                {deadlineInfo.status === 'today' && 'Utløper i dag!'}
                {deadlineInfo.status === 'tomorrow' && 'Utløper i morgen'}
                {deadlineInfo.status === 'soon' && `${deadlineInfo.days} dager igjen`}
                {deadlineInfo.status === 'week' && `${deadlineInfo.days} dager igjen`}
                {deadlineInfo.status === 'normal' && `${deadlineInfo.days} dager igjen`}
              </Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => openTask(item.id)}
            style={[styles.editButton, { backgroundColor: theme.info }]}
          >
            <Text style={styles.editButtonText}>✏️ Rediger</Text>
          </TouchableOpacity>
          
          {isItemSwiped && (
            <View style={styles.swipeActions}>
              <TouchableOpacity 
                style={[styles.swipeDeleteButton, { backgroundColor: theme.error }]}
                onPress={() => confirmDelete(item.id, item.title)}
              >
                <Text style={styles.swipeDeleteText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.header, { color: theme.textPrimary }]}>Mine oppgaver</Text>
        <ThemeToggle />
      </View>

      <View style={styles.headerActions}>
        <TouchableOpacity 
          style={[styles.dashboardButton, { backgroundColor: '#2196F3' }]}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={styles.dashboardButtonText}>📊 Dashboard</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput, 
            { 
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
              color: theme.textPrimary 
            }
          ]}
          placeholder="🔍 Søk etter oppgaver..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor={theme.textTertiary}
        />
        {searchText.length > 0 && (
          <TouchableOpacity 
            style={[styles.clearSearchButton, { backgroundColor: theme.textTertiary }]}
            onPress={() => setSearchText('')}
          >
            <Text style={styles.clearSearchText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton, 
            { 
              backgroundColor: filter === 'all' ? theme.info : theme.cardBackground,
              borderColor: theme.border 
            }
          ]}
          onPress={() => setFilter('all')}
        >
          <Text style={[
            styles.filterButtonText, 
            { color: filter === 'all' ? '#fff' : theme.textSecondary }
          ]}>
            Alle ({tasks.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton, 
            { 
              backgroundColor: filter === 'active' ? theme.info : theme.cardBackground,
              borderColor: theme.border 
            }
          ]}
          onPress={() => setFilter('active')}
        >
          <Text style={[
            styles.filterButtonText, 
            { color: filter === 'active' ? '#fff' : theme.textSecondary }
          ]}>
            Aktive ({tasks.filter(t => t.status === 'open').length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton, 
            { 
              backgroundColor: filter === 'completed' ? theme.info : theme.cardBackground,
              borderColor: theme.border 
            }
          ]}
          onPress={() => setFilter('completed')}
        >
          <Text style={[
            styles.filterButtonText, 
            { color: filter === 'completed' ? '#fff' : theme.textSecondary }
          ]}>
            Fullført ({tasks.filter(t => t.status === 'completed').length})
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.categoryFilterContainer}>
        <Text style={[styles.categoryFilterLabel, { color: theme.textPrimary }]}>Kategori:</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryFilterScroll}
          contentContainerStyle={styles.categoryFilterContent}
        >
          <TouchableOpacity
            style={[
              styles.categoryFilterButton,
              { 
                backgroundColor: categoryFilter === 'all' ? theme.info : theme.cardBackground,
                borderColor: theme.info,
                borderWidth: categoryFilter === 'all' ? 0 : 1 
              }
            ]}
            onPress={() => setCategoryFilter('all')}
          >
            <Text style={[
              styles.categoryFilterText,
              { color: categoryFilter === 'all' ? '#fff' : theme.textSecondary }
            ]}>
              📋 Alle ({tasks.length})
            </Text>
          </TouchableOpacity>

          {categoryOptions.map((category) => (
            <TouchableOpacity
              key={category.value}
              style={[
                styles.categoryFilterButton,
                { 
                  backgroundColor: categoryFilter === category.value ? category.color : theme.cardBackground,
                  borderColor: category.color,
                  borderWidth: categoryFilter === category.value ? 0 : 1
                }
              ]}
              onPress={() => setCategoryFilter(category.value)}
            >
              <Text style={[
                styles.categoryFilterText,
                { color: categoryFilter === category.value ? '#fff' : theme.textSecondary }
              ]}>
                {category.label} ({tasks.filter(t => (t.category || 'Personlig') === category.value).length})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.sortContainer}>
        <Text style={[styles.sortLabel, { color: theme.textPrimary }]}>Sorter:</Text>
        
        <TouchableOpacity
          style={[
            styles.sortButton, 
            { 
              backgroundColor: sortBy === 'date' ? theme.success : theme.cardBackground,
              borderColor: theme.border 
            }
          ]}
          onPress={() => setSortBy('date')}
        >
          <Text style={[
            styles.sortButtonText, 
            { color: sortBy === 'date' ? '#fff' : theme.textSecondary }
          ]}>
            📅 Dato
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sortButton, 
            { 
              backgroundColor: sortBy === 'priority' ? theme.success : theme.cardBackground,
              borderColor: theme.border 
            }
          ]}
          onPress={() => setSortBy('priority')}
        >
          <Text style={[
            styles.sortButtonText, 
            { color: sortBy === 'priority' ? '#fff' : theme.textSecondary }
          ]}>
            ⚡ Prioritet
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sortButton, 
            { 
              backgroundColor: sortBy === 'none' ? theme.success : theme.cardBackground,
              borderColor: theme.border 
            }
          ]}
          onPress={() => setSortBy('none')}
        >
          <Text style={[
            styles.sortButtonText, 
            { color: sortBy === 'none' ? '#fff' : theme.textSecondary }
          ]}>
            📝 Standard
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.info} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            Laster oppgaver...
          </Text>
        </View>
      ) : getFilteredSearchedAndSortedTasks().length === 0 ? (
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          {searchText.trim() 
            ? `Ingen oppgaver funnet for "${searchText}"` 
            : categoryFilter !== 'all' 
              ? `Ingen oppgaver i kategorien "${getCategoryInfo(categoryFilter).label}"`
              : filter === 'all' ? 'Ingen oppgaver ennå' : 
                filter === 'active' ? 'Ingen aktive oppgaver' : 
                'Ingen fullførte oppgaver'}
        </Text>
      ) : (
        <FlatList
          data={getFilteredSearchedAndSortedTasks()}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          style={styles.taskList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.info]}
              tintColor={theme.info}
            />
          }
          onScrollBeginDrag={() => setSwipedItemId(null)}
        />
      )}

      <TouchableOpacity 
        style={[styles.createButton, { backgroundColor: theme.info }]}
        onPress={() => navigation.navigate('CreateTask')}
      >
        <Text style={styles.createButtonText}>+ Opprett ny oppgave</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 50,
  },
  taskList: {
    flex: 1,
  },
  taskItemContainer: {
    marginBottom: 10,
    position: 'relative',
  },
  deleteBackground: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 8,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  deleteBackgroundIcon: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 4,
  },
  deleteBackgroundText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  taskCard: {
    borderRadius: 8,
    padding: 15,
    flexDirection: 'column',
    elevation: 3,
    position: 'relative',
  },
  taskCardSwiped: {
    marginRight: 80,
  },
  taskContent: {
    flex: 1,
    paddingBottom: 10,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  swipeIndicator: {
    marginLeft: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeIndicatorText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  swipeActions: {
    position: 'absolute',
    right: -80,
    top: 0,
    bottom: 0,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeDeleteButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  swipeDeleteText: {
    fontSize: 24,
    color: '#fff',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  taskDetail: {
    fontSize: 14,
    marginBottom: 2,
  },
  createButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 8,
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  sortButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 1,
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  searchInput: {
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    elevation: 2,
    paddingRight: 45,
  },
  clearSearchButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearSearchText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deadlineBadge: {
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  deadlineBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  categoryContainer: {
    marginBottom: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 5,
  },
  categoryBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  categoryFilterContainer: {
    marginBottom: 15,
  },
  categoryFilterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  categoryFilterScroll: {
    flexGrow: 0,
  },
  categoryFilterContent: {
    paddingRight: 10,
  },
  categoryFilterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    elevation: 2,
  },
  categoryFilterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  headerActions: {
    marginBottom: 20,
  },
  dashboardButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3,
  },
  dashboardButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});