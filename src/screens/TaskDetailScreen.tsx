// /src/screens/TaskDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';

import { useTasks } from '../features/tasks/hooks/useTasks';
import { Task } from '../features/tasks/types/task.types';
import { validateTaskForm } from '../shared/utils/taskValidation';

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { TaskForm, TaskFormData } from '../features/tasks/components/TaskForm';
import { useTheme } from '../context/ThemeContext';

export default function TaskDetailScreen({ navigation, route }: any) {
  const { theme } = useTheme();
  const { taskId } = route.params;
  const { tasks, updateTask, deleteTask } = useTasks();

  const [task, setTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    due_date: '',
    priority: 'Medium',
    category: 'Personlig',
  });
  
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const foundTask = tasks.find(t => t.id === taskId);
    if (foundTask) {
      setTask(foundTask);
      setFormData({
        title: foundTask.title,
        description: foundTask.description || '',
        due_date: foundTask.due_date,
        priority: foundTask.priority,
        category: foundTask.category || 'Personlig',
      });
      setCompleted(foundTask.status === 'completed');
    }
  }, [tasks, taskId]);

  const updateField = (field: keyof TaskFormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const goBackToList = () => {
    navigation.navigate('TaskList');
  };

  const handleSaveTask = async () => {
    const validation = validateTaskForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      const errorMsg = Object.entries(validation.errors)
        .map(([key, val]) => `${key}: ${val}`)
        .join('\n');
      
      if (Platform.OS === 'web') {
        alert(`Valideringsfeil:\n${errorMsg}`);
      } else {
        Alert.alert('Valideringsfeil', errorMsg);
      }
      return;
    }

    setSaving(true);
    
    const updateData = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      due_date: formData.due_date,
      priority: formData.priority,
      category: formData.category,
      status: (completed ? 'completed' : 'open') as 'completed' | 'open',
    };
    
    const result = await updateTask(taskId, updateData);
    setSaving(false);

    if (result.success) {
      if (Platform.OS === 'web') {
        alert('Oppgaven ble lagret!');
        goBackToList();
      } else {
        Alert.alert('Suksess', 'Oppgaven ble lagret!', [
          { text: 'OK', onPress: () => goBackToList() }
        ]);
      }
    } else {
      if (Platform.OS === 'web') {
        alert(result.error || 'Kunne ikke lagre endringer.');
      } else {
        Alert.alert('Feil', result.error || 'Kunne ikke lagre endringer.');
      }
    }
  };

  const handleDeleteTask = async () => {
    const confirmDelete = Platform.OS === 'web'
      ? window.confirm(`Vil du slette "${task?.title}"?`)
      : await new Promise<boolean>((resolve) => {
          Alert.alert(
            'Slett oppgave',
            `Vil du slette "${task?.title}"?`,
            [
              { text: 'Avbryt', style: 'cancel', onPress: () => resolve(false) },
              { text: 'Slett', style: 'destructive', onPress: () => resolve(true) }
            ]
          );
        });

    if (confirmDelete) {
      const result = await deleteTask(taskId);
      if (result.success) {
        goBackToList();
      } else {
        if (Platform.OS === 'web') {
          alert(result.error || 'Kunne ikke slette oppgaven.');
        } else {
          Alert.alert('Feil', result.error || 'Kunne ikke slette oppgaven.');
        }
      }
    }
  };

  if (!task) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.info} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header 
        title="Rediger oppgave"
        subtitle={`Opprettet ${new Date(task.created_at || Date.now()).toLocaleDateString('nb-NO')}`}
        showThemeToggle={false}
      />

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TaskForm
          formData={formData}
          onFieldChange={updateField}
          errors={errors}
          showCompletedStatus={true}
          completed={completed}
          onCompletedChange={setCompleted}
        />
      </ScrollView>

      <View style={styles.actionButtons}>
        <Button
          variant="secondary"
          size="large"
          onPress={goBackToList}
          disabled={saving}
          style={styles.button}
        >
          Tilbake
        </Button>

        <Button
          variant="secondary"
          size="large"
          onPress={handleDeleteTask}
          disabled={saving}
          style={styles.button}
        >
          Slett
        </Button>
        
        <Button
          variant="primary"
          size="large"
          onPress={handleSaveTask}
          disabled={saving}
          style={styles.button}
        >
          {saving ? 'Lagrer...' : 'Lagre'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 16,
  },
  button: {
    flex: 1,
  },
});