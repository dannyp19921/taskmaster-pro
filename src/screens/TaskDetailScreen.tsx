// /src/screens/TaskDetailScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '../services/supabase';

interface Task {
  id: string;
  title: string;
  due_date: string;
  priority: string;
  status: string;
  user_id: string;
}

export default function TaskDetailScreen({ navigation, route }: any) {
  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);

  const { taskId } = route.params;

  // Enkel dato-validering
  const isValidDate = (dateString: string) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime()) && dateString.match(/^\d{4}-\d{2}-\d{2}$/);
  };

  // Hent oppgave når skjermen lastes
  useEffect(() => {
    fetchTask();
  }, []);

  const fetchTask = async () => {
    console.log('📡 Henter oppgave med ID:', taskId);

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (error) {
        console.log('❌ Feil ved henting av oppgave:', error.message);
        alert('Kunne ikke hente oppgaven');
        navigation.goBack();
        return;
      }

      console.log('✅ Oppgave hentet:', data);
      setTask(data);
      setTitle(data.title);
      setDueDate(data.due_date);
      setPriority(data.priority);
      setCompleted(data.status === 'completed');
    } catch (error) {
      console.log('💥 Uventet feil:', error);
      alert('En uventet feil oppstod');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTask = async () => {
    console.log('💾 LAGRE ENDRINGER TRYKKET');

    // Validering
    if (!title.trim()) {
      alert('Tittel kan ikke være tom');
      return;
    }

    if (!dueDate.trim()) {
      alert('Frist må fylles ut');
      return;
    }

    if (!isValidDate(dueDate)) {
      alert('Frist må være i format YYYY-MM-DD (f.eks. 2025-12-31)');
      return;
    }

    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          title: title.trim(),
          due_date: dueDate,
          priority: priority,
          status: completed ? 'completed' : 'open',
        })
        .eq('id', taskId);

      if (error) {
        console.log('❌ Kunne ikke lagre:', error.message);
        alert('Kunne ikke lagre endringene: ' + error.message);
        return;
      }

      console.log('✅ Oppgave lagret!');
      alert('Endringer lagret!');
      navigation.goBack();
    } catch (error) {
      console.log('💥 Uventet feil ved lagring:', error);
      alert('En uventet feil oppstod');
    }
  };

  const handleDeleteTask = async () => {
    const shouldDelete = confirm('Er du sikker på at du vil slette denne oppgaven?');
    
    if (!shouldDelete) {
      return;
    }

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) {
        console.log('❌ Kunne ikke slette:', error.message);
        alert('Kunne ikke slette oppgaven: ' + error.message);
        return;
      }

      console.log('✅ Oppgave slettet!');
      alert('Oppgave slettet!');
      navigation.goBack();
    } catch (error) {
      console.log('💥 Uventet feil ved sletting:', error);
      alert('En uventet feil oppstod');
    }
  };

  // Prioritet dropdown
  const renderPriorityPicker = () => (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity 
        style={styles.dropdownButton}
        onPress={() => setShowPriorityPicker(!showPriorityPicker)}
      >
        <Text style={styles.dropdownButtonText}>
          {priority === 'High' ? '🔴 Høy' : 
           priority === 'Medium' ? '🟡 Medium' : 
           '🟢 Lav'}
        </Text>
        <Text style={styles.dropdownArrow}>
          {showPriorityPicker ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {showPriorityPicker && (
        <View style={styles.dropdownOptions}>
          <TouchableOpacity
            style={[styles.dropdownOption, priority === 'High' && styles.dropdownOptionActive]}
            onPress={() => {
              setPriority('High');
              setShowPriorityPicker(false);
            }}
          >
            <Text style={[styles.dropdownOptionText, priority === 'High' && styles.dropdownOptionTextActive]}>
              🔴 Høy
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dropdownOption, priority === 'Medium' && styles.dropdownOptionActive]}
            onPress={() => {
              setPriority('Medium');
              setShowPriorityPicker(false);
            }}
          >
            <Text style={[styles.dropdownOptionText, priority === 'Medium' && styles.dropdownOptionTextActive]}>
              🟡 Medium
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dropdownOption, { borderBottomWidth: 0 }, priority === 'Low' && styles.dropdownOptionActive]}
            onPress={() => {
              setPriority('Low');
              setShowPriorityPicker(false);
            }}
          >
            <Text style={[styles.dropdownOptionText, priority === 'Low' && styles.dropdownOptionTextActive]}>
              🟢 Lav
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Laster oppgave...</Text>
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.errorContainer}>
        <Text>Oppgaven ble ikke funnet</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Gå tilbake</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Rediger oppgave</Text>

      {/* Tittel input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tittel *</Text>
        <TextInput
          placeholder="Skriv inn tittel..."
          value={title}
          onChangeText={setTitle}
          style={styles.textInput}
        />
      </View>

      {/* Dato input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Frist *</Text>
        <TextInput
          placeholder="YYYY-MM-DD (f.eks. 2025-12-31)"
          value={dueDate}
          onChangeText={setDueDate}
          style={styles.textInput}
        />
        <Text style={styles.helpText}>
          Format: År-Måned-Dag (f.eks. 2025-07-30)
        </Text>
      </View>

      {/* Prioritet dropdown */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Prioritet *</Text>
        {renderPriorityPicker()}
      </View>

      {/* Completed checkbox */}
      <View style={styles.inputContainer}>
        <TouchableOpacity 
          style={styles.statusToggle}
          onPress={() => setCompleted(!completed)}
        >
          <View style={[styles.checkbox, completed && styles.checkboxChecked]}>
            {completed && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.statusText}>
            {completed ? 'Oppgave fullført' : 'Oppgave ikke fullført'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Action knapper */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveTask}>
          <Text style={styles.buttonText}>Lagre endringer</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteTask}>
          <Text style={styles.buttonText}>Slett oppgave</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Avbryt</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    elevation: 2,
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  dropdownContainer: {
    marginBottom: 10,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownArrow: {
    fontSize: 14,
    color: '#666',
  },
  dropdownOptions: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    elevation: 5,
    marginTop: -1,
  },
  dropdownOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownOptionActive: {
    backgroundColor: '#007AFF',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownOptionTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  statusToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    elevation: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 30,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});