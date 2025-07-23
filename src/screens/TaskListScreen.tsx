// /src/screens/TaskListScreen.tsx - Med kategori-visning

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, TextInput, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../services/supabase';

// Type for oppgave - gjør koden mer forståelig
interface Task {
  id: string;
  title: string;
  due_date: string;
  priority: string;
  category?: string; // Legg til category som optional (for bakoverkompatibilitet)
  status: string; // 'open' eller 'completed'
  user_id: string;
}

interface TaskListScreenProps {
  navigation: any; // Kan typeres mer spesifikt senere
}

export default function TaskListScreen({ navigation }: TaskListScreenProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // Pull-to-refresh state
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all'); // Ny state for kategori-filter
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'none'>('date');
  const [searchText, setSearchText] = useState(''); // Ny state for søk

  // Kategori-alternativer (samme som i CreateTaskScreen og TaskDetailScreen)
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

  // Finn kategori-info basert på kategori-verdi
  const getCategoryInfo = (categoryValue?: string) => {
    if (!categoryValue) {
      return categoryOptions[1]; // Default til 'Personlig' hvis kategori mangler
    }
    return categoryOptions.find(cat => cat.value === categoryValue) || categoryOptions[1];
  };

  // Hent oppgaver fra database (med optional refresh parameter)
  const fetchTasks = async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        console.log('🔄 Refresher oppgaver...');
      } else {
        console.log('📡 Henter oppgaver...');
      }
      
      // Sjekk om bruker er innlogget
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.log('🚫 Ikke innlogget:', userError?.message);
        return;
      }

      // Hent brukerens oppgaver
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

  // Slett oppgave - bruker samme logikk som fungerte før
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
      await fetchTasks(); // Oppdater liste - samme som før
    } catch (err) {
      console.log('💥 Uventet feil i handleDeleteTask:', err);
    }
  };

  // Vis bekreftelse før sletting - enklere versjon som fungerer overalt
  const confirmDelete = (taskId: string, taskTitle: string) => {
    console.log('🟠 Trykket slett med bekreftelse på:', taskId);
    
    // Enkel bekreftelse med confirm() - fungerer på alle plattformer
    const shouldDelete = confirm(`Er du sikker på at du vil slette "${taskTitle}"?`);
    
    if (shouldDelete) {
      console.log('🟢 BEKREFTELSE GODKJENT - taskId:', taskId);
      handleDeleteTask(taskId);
    } else {
      console.log('❌ BEKREFTELSE AVBRUTT');
    }
  };

  // Åpne oppgave for redigering
  const openTask = (taskId: string) => {
    navigation.navigate('TaskDetail', { taskId });
  };

  // Pull-to-refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    fetchTasks(true);
  };

  // Last oppgaver når skjermen lastes ELLER kommer i fokus
  useEffect(() => {
    fetchTasks();
  }, []);

  // Oppdater oppgaver hver gang skjermen kommer i fokus (f.eks. når du går tilbake fra TaskDetail)
  useFocusEffect(
    useCallback(() => {
      console.log('🔄 TaskListScreen kom i fokus - oppdaterer oppgaver');
      fetchTasks();
    }, [])
  );

  // Enkle sortering-knapper
  const renderSortButtons = () => (
    <View style={styles.sortContainer}>
      <Text style={styles.sortLabel}>Sorter:</Text>
      
      <TouchableOpacity
        style={[styles.sortButton, sortBy === 'date' && styles.sortButtonActive]}
        onPress={() => setSortBy('date')}
      >
        <Text style={[styles.sortButtonText, sortBy === 'date' && styles.sortButtonTextActive]}>
          📅 Dato
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.sortButton, sortBy === 'priority' && styles.sortButtonActive]}
        onPress={() => setSortBy('priority')}
      >
        <Text style={[styles.sortButtonText, sortBy === 'priority' && styles.sortButtonTextActive]}>
          ⚡ Prioritet
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.sortButton, sortBy === 'none' && styles.sortButtonActive]}
        onPress={() => setSortBy('none')}
      >
        <Text style={[styles.sortButtonText, sortBy === 'none' && styles.sortButtonTextActive]}>
          📝 Standard
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Deadline-logikk for å beregne status
  const getDeadlineStatus = (dueDate: string) => {
    const today = new Date();
    const deadline = new Date(dueDate);
    
    // Reset tid for sammenligning (kun dato)
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);
    
    const timeDiff = deadline.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff < 0) {
      return { status: 'overdue', days: Math.abs(daysDiff), color: '#ff4444', badge: 'UTLØPT' };
    } else if (daysDiff === 0) {
      return { status: 'today', days: 0, color: '#ff6b35', badge: 'I DAG!' };
    } else if (daysDiff === 1) {
      return { status: 'tomorrow', days: 1, color: '#ffa500', badge: 'I MORGEN' };
    } else if (daysDiff <= 3) {
      return { status: 'soon', days: daysDiff, color: '#ffcc00', badge: `${daysDiff} DAGER` };
    } else if (daysDiff <= 7) {
      return { status: 'week', days: daysDiff, color: '#4CAF50', badge: `${daysDiff} DAGER` };
    } else {
      return { status: 'normal', days: daysDiff, color: '#666', badge: null };
    }
  };

  // Søkeboks komponent
  const renderSearchBox = () => (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="🔍 Søk etter oppgaver..."
        value={searchText}
        onChangeText={setSearchText}
        placeholderTextColor="#999"
      />
      {searchText.length > 0 && (
        <TouchableOpacity 
          style={styles.clearSearchButton}
          onPress={() => setSearchText('')}
        >
          <Text style={styles.clearSearchText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Filter, søk og sorteringslogikk kombinert (MED KATEGORI-FILTER)
  const getFilteredSearchedAndSortedTasks = () => {
    // Først filtrer etter status
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

    // Så filtrer etter kategori
    if (categoryFilter !== 'all') {
      filteredTasks = filteredTasks.filter(task => {
        const taskCategory = task.category || 'Personlig'; // Fallback til Personlig
        return taskCategory === categoryFilter;
      });
    }

    // Så søk i tittel
    if (searchText.trim()) {
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(searchText.toLowerCase().trim())
      );
    }

    // Til slutt sorter
    switch (sortBy) {
      case 'priority':
        return filteredTasks.sort((a, b) => {
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          return bPriority - aPriority; // Høyeste prioritet først
        });
      case 'date':
        return filteredTasks.sort((a, b) => {
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime(); // Nærmeste dato først
        });
      default:
        return filteredTasks;
    }
  };

  // Enkle filter-knapper
  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
        onPress={() => setFilter('all')}
      >
        <Text style={[styles.filterButtonText, filter === 'all' && styles.filterButtonTextActive]}>
          Alle ({tasks.length})
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.filterButton, filter === 'active' && styles.filterButtonActive]}
        onPress={() => setFilter('active')}
      >
        <Text style={[styles.filterButtonText, filter === 'active' && styles.filterButtonTextActive]}>
          Aktive ({tasks.filter(t => t.status === 'open').length})
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.filterButton, filter === 'completed' && styles.filterButtonActive]}
        onPress={() => setFilter('completed')}
      >
        <Text style={[styles.filterButtonText, filter === 'completed' && styles.filterButtonTextActive]}>
          Fullført ({tasks.filter(t => t.status === 'completed').length})
        </Text>
      </TouchableOpacity>
    </View>
  );

  // NY: Kategori-filter knapper med horizontal scroll
  const renderCategoryFilterButtons = () => {
    // Beregn antall oppgaver per kategori (basert på gjeldende status-filter)
    let relevantTasks = tasks;
    switch (filter) {
      case 'active':
        relevantTasks = tasks.filter(task => task.status === 'open');
        break;
      case 'completed':
        relevantTasks = tasks.filter(task => task.status === 'completed');
        break;
      default:
        relevantTasks = tasks;
    }

    const getCategoryCount = (categoryValue: string) => {
      if (categoryValue === 'all') {
        return relevantTasks.length;
      }
      return relevantTasks.filter(task => {
        const taskCategory = task.category || 'Personlig';
        return taskCategory === categoryValue;
      }).length;
    };

    return (
      <View style={styles.categoryFilterContainer}>
        <Text style={styles.categoryFilterLabel}>Kategori:</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryFilterScroll}
          contentContainerStyle={styles.categoryFilterContent}
        >
          {/* Alle kategorier knapp */}
          <TouchableOpacity
            style={[
              styles.categoryFilterButton,
              categoryFilter === 'all' && styles.categoryFilterButtonActive,
              { backgroundColor: categoryFilter === 'all' ? '#007AFF' : '#f0f0f0' }
            ]}
            onPress={() => setCategoryFilter('all')}
          >
            <Text style={[
              styles.categoryFilterText,
              categoryFilter === 'all' && styles.categoryFilterTextActive
            ]}>
              📋 Alle ({getCategoryCount('all')})
            </Text>
          </TouchableOpacity>

          {/* Kategori-spesifikke knapper */}
          {categoryOptions.map((category) => (
            <TouchableOpacity
              key={category.value}
              style={[
                styles.categoryFilterButton,
                categoryFilter === category.value && styles.categoryFilterButtonActive,
                { 
                  backgroundColor: categoryFilter === category.value 
                    ? category.color 
                    : '#f0f0f0',
                  borderColor: category.color,
                  borderWidth: categoryFilter === category.value ? 0 : 1
                }
              ]}
              onPress={() => setCategoryFilter(category.value)}
            >
              <Text style={[
                styles.categoryFilterText,
                categoryFilter === category.value && styles.categoryFilterTextActive
              ]}>
                {category.label} ({getCategoryCount(category.value)})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  // Vis en enkelt oppgave med deadline-varsler og KATEGORI
  const renderTask = ({ item }: { item: Task }) => {
    const deadlineInfo = getDeadlineStatus(item.due_date);
    const isCompleted = item.status === 'completed';
    const categoryInfo = getCategoryInfo(item.category);
    
    return (
      <View style={[
        styles.taskCard,
        // Grå ut fullførte oppgaver
        isCompleted && { backgroundColor: '#f8f8f8' },
        // Fargekoding for deadline (kun på aktive oppgaver)
        !isCompleted && { borderLeftWidth: 4, borderLeftColor: deadlineInfo.color }
      ]}>
        <TouchableOpacity onPress={() => openTask(item.id)} style={styles.taskContent}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={[
              styles.taskTitle,
              // Gjør fullførte oppgaver mindre fremtredende
              isCompleted && { 
                textDecorationLine: 'line-through', 
                color: '#999' 
              }
            ]}>
              {item.title}
            </Text>
            {isCompleted && (
              <Text style={{ 
                marginLeft: 10, 
                color: '#4CAF50', 
                fontSize: 16, 
                fontWeight: 'bold' 
              }}>
                ✓
              </Text>
            )}
            {/* Deadline badge (kun på aktive oppgaver) */}
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
          
          {/* NY: Kategori-visning med farge og ikon */}
          <View style={styles.categoryContainer}>
            <View style={[styles.categoryBadge, { backgroundColor: categoryInfo.color }]}>
              <Text style={styles.categoryBadgeText}>
                {categoryInfo.label}
              </Text>
            </View>
          </View>
          
          <Text style={styles.taskDetail}>Frist: {item.due_date}</Text>
          <Text style={styles.taskDetail}>Prioritet: {item.priority}</Text>
          <Text style={[
            styles.taskDetail,
            isCompleted ? { color: '#4CAF50' } : { color: '#ff8800' }
          ]}>
            Status: {isCompleted ? 'Fullført' : 'Aktiv'}
          </Text>
          
          {/* Deadline info (kun på aktive oppgaver) */}
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
          style={styles.deleteButton}
          onPress={() => confirmDelete(item.id, item.title)}
        >
          <Text style={styles.deleteButtonText}>🗑️ Slett</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mine oppgaver</Text>

      {/* Søkeboks */}
      {renderSearchBox()}

      {/* Filter-knapper */}
      {renderFilterButtons()}

      {/* NY: Kategori-filter knapper */}
      {renderCategoryFilterButtons()}

      {/* Sortering-knapper */}
      {renderSortButtons()}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Laster oppgaver...</Text>
        </View>
      ) : getFilteredSearchedAndSortedTasks().length === 0 ? (
        <Text style={styles.emptyText}>
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
              colors={['#007AFF']} // Android
              tintColor="#007AFF" // iOS
            />
          }
        />
      )}

      <TouchableOpacity 
        style={styles.createButton}
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
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
    color: '#666',
    marginTop: 50,
  },
  taskList: {
    flex: 1,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    padding: 15,
    flexDirection: 'column',
    // Kun elevation for alle plattformer - enklere og fungerer bedre
    elevation: 3,
  },
  taskContent: {
    flex: 1,
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  taskDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#007AFF',
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
  // Filter-knapper styling
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
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  // Sortering-knapper styling
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 8,
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  sortButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f8f8',
  },
  sortButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  sortButtonTextActive: {
    color: '#fff',
  },
  // Søkeboks styling
  searchContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
    paddingRight: 45, // Plass for clear-knapp
  },
  clearSearchButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearSearchText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Deadline-varsler styling
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
  // NY: Kategori-styling
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
  // NY: Kategori-filter styling
  categoryFilterContainer: {
    marginBottom: 15,
  },
  categoryFilterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
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
  categoryFilterButtonActive: {
    elevation: 4,
  },
  categoryFilterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  categoryFilterTextActive: {
    color: '#fff',
  },
});