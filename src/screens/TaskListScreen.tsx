// /src/screens/TaskListScreen.tsx - Oppryddet versjon

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { supabase } from '../services/supabase';

// Type for oppgave - gjør koden mer forståelig
interface Task {
  id: string;
  title: string;
  due_date: string;
  priority: string;
  user_id: string;
}

interface TaskListScreenProps {
  navigation: any; // Kan typeres mer spesifikt senere
}

export default function TaskListScreen({ navigation }: TaskListScreenProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Last oppgaver når skjermen lastes
  useEffect(() => {
    fetchTasks();
  }, []);

  // Vis en enkelt oppgave
  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskCard}>
      <TouchableOpacity onPress={() => openTask(item.id)} style={styles.taskContent}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.taskDetail}>Frist: {item.due_date}</Text>
        <Text style={styles.taskDetail}>Prioritet: {item.priority}</Text>
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

      {loading ? (
        <Text style={styles.loadingText}>Laster oppgaver...</Text>
      ) : tasks.length === 0 ? (
        <Text style={styles.emptyText}>Ingen oppgaver ennå</Text>
      ) : (
        <FlatList
          data={tasks}
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
});