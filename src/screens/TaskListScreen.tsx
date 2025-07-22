// /src/screens/TaskListScreen.tsx - Oppryddet versjon

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../services/supabase';

// Type for oppgave - gjør koden mer forståelig
interface Task {
  id: string;
  title: string;
  due_date: string;
  priority: string;
  status: string; // 'open' eller 'completed'
  user_id: string;
}

interface TaskListScreenProps {
  navigation: any; // Kan typeres mer spesifikt senere
}

export default function TaskListScreen({ navigation }: TaskListScreenProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'none'>('date');
  const [searchText, setSearchText] = useState(''); // Ny state for søk

  // Hent oppgaver fra database
  const fetchTasks = async () => {
    try {
      console.log('📡 Henter oppgaver...');
      
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
        Alert.alert('Feil', 'Kunne ikke hente oppgaver');
        return;
      }

      console.log('✅ Oppgaver hentet:', data?.length || 0);
      setTasks(data || []);
    } catch (error) {
      console.log('💥 Uventet feil:', error);
      Alert.alert('Feil', 'En uventet feil oppstod');
    } finally {
      setLoading(false);
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
  )
  
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

  // Filter, søk og sorteringslogikk kombinert
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

  // Vis en enkelt oppgave
  const renderTask = ({ item }: { item: Task }) => (
    <View style={[
      styles.taskCard,
      // Grå ut fullførte oppgaver
      item.status === 'completed' && { backgroundColor: '#f8f8f8' }
    ]}>
      <TouchableOpacity onPress={() => openTask(item.id)} style={styles.taskContent}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
          <Text style={[
            styles.taskTitle,
            // Gjør fullførte oppgaver mindre fremtredende
            item.status === 'completed' && { 
              textDecorationLine: 'line-through', 
              color: '#999' 
            }
          ]}>
            {item.title}
          </Text>
          {item.status === 'completed' && (
            <Text style={{ 
              marginLeft: 10, 
              color: '#4CAF50', 
              fontSize: 16, 
              fontWeight: 'bold' 
            }}>
              ✓
            </Text>
          )}
        </View>
        <Text style={styles.taskDetail}>Frist: {item.due_date}</Text>
        <Text style={styles.taskDetail}>Prioritet: {item.priority}</Text>
        <Text style={[
          styles.taskDetail,
          item.status === 'completed' ? { color: '#4CAF50' } : { color: '#ff8800' }
        ]}>
          Status: {item.status === 'completed' ? 'Fullført' : 'Aktiv'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => {
          console.log('🟥 DIREKTE SLETTING - item.id:', item.id);
          handleDeleteTask(item.id);
        }}
      >
        <Text style={styles.deleteButtonText}>Slett direkte</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.deleteButton, { backgroundColor: '#ff8800', marginTop: 5 }]}
        onPress={() => confirmDelete(item.id, item.title)}
      >
        <Text style={styles.deleteButtonText}>Slett (bekreft)</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mine oppgaver</Text>

      {/* Søkeboks */}
      {renderSearchBox()}

      {/* Filter-knapper */}
      {renderFilterButtons()}

      {/* Sortering-knapper */}
      {renderSortButtons()}

      {loading ? (
        <Text style={styles.loadingText}>Laster oppgaver...</Text>
      ) : getFilteredSearchedAndSortedTasks().length === 0 ? (
        <Text style={styles.emptyText}>
          {searchText.trim() 
            ? `Ingen oppgaver funnet for "${searchText}"` 
            : filter === 'all' ? 'Ingen oppgaver ennå' : 
              filter === 'active' ? 'Ingen aktive oppgaver' : 
              'Ingen fullførte oppgaver'}
        </Text>
      ) : (
        <FlatList
          data={getFilteredSearchedAndSortedTasks()} // Bruk kombinert søk, filter og sortering
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          style={styles.taskList}
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
    marginTop: 50,
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
});