// /src/screens/TaskDetailScreen.tsx - ULTRA CLEAN med TaskForm! 🚀

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';

// 🎯 Business logic
import { useTasks } from '../features/tasks/hooks/useTasks';
import { Task } from '../features/tasks/types/task.types';

// 🎨 UI components - Much cleaner!
import { Button, Text } from '../shared/ui';
import { Header } from '../shared/ui/organisms/Header';
import { TaskForm, TaskFormData } from '../features/tasks/components/TaskForm';

// 🌐 Context
import { useTheme } from '../context/ThemeContext';

export default function TaskDetailScreen({ navigation, route }: any) {
  const { theme } = useTheme();
  const { taskId } = route.params;
  const { tasks, updateTask, deleteTask, loading: tasksLoading } = useTasks();

  // 🎯 State management
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

  // 🎯 Form handler - super clean!
  const updateField = (field: keyof TaskFormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // 📡 Find task from existing state
  useEffect(() => {
    if (tasks.length > 0) {
      const foundTask = tasks.find(t => t.id === taskId);
      
      if (foundTask) {
        console.log('✅ Oppgave funnet i existing state:', foundTask);
        setTask(foundTask);
        setFormData({
          title: foundTask.title,
          description: foundTask.description || '',
          due_date: foundTask.due_date,
          priority: foundTask.priority,
          category: foundTask.category || 'Personlig',
        });
        setCompleted(foundTask.status === 'completed');
      } else {
        console.log('❌ Oppgave ikke funnet i state');
        Alert.alert('Feil', 'Oppgaven ble ikke funnet');
        navigation.goBack();
      }
    }
  }, [tasks, taskId, navigation]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Tittel er påkrevd';
    }

    if (!formData.due_date) {
      newErrors.due_date = 'Forfallsdato er påkrevd';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveTask = async () => {
    console.log('💾 LAGRE ENDRINGER TRYKKET');

    if (!validateForm()) {
      Alert.alert('Valideringsfeil', 'Vennligst rett opp feilene og prøv igjen');
      return;
    }

    try {
      setSaving(true);
      console.log('💾 Lagrer endringer for oppgave:', taskId);

      const success = await updateTask(taskId, {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        due_date: formData.due_date,
        priority: formData.priority,
        category: formData.category,
        status: completed ? 'completed' : 'open',
      });

      if (success) {
        console.log('✅ Oppgave lagret via useTasks hook!');
        Alert.alert('Suksess', 'Endringer lagret!');
        navigation.goBack();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTask = async () => {
    Alert.alert(
      'Slett oppgave',
      'Er du sikker på at du vil slette denne oppgaven?',
      [
        { text: 'Avbryt', style: 'cancel' },
        { 
          text: 'Slett', 
          style: 'destructive', 
          onPress: async () => {
            const success = await deleteTask(taskId);
            
            if (success) {
              console.log('✅ Oppgave slettet via useTasks hook!');
              Alert.alert('Suksess', 'Oppgave slettet!');
              navigation.goBack();
            }
          }
        }
      ]
    );
  };

  // 🔄 Loading state
  if (tasksLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text variant="body1" color="secondary" style={styles.loadingText}>
          Laster oppgave...
        </Text>
      </View>
    );
  }

  // ❌ Error state
  if (!task) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.background }]}>
        <Text variant="h2" color="primary" style={styles.errorTitle}>
          Oppgaven ble ikke funnet
        </Text>
        <Text variant="body1" color="secondary" style={styles.errorSubtitle}>
          Oppgaven eksisterer ikke eller du har ikke tilgang til den.
        </Text>
        <Button
          variant="primary"
          size="large"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          Gå tilbake
        </Button>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* 📱 Header */}
      <Header 
        title="Rediger oppgave"
        subtitle={`Opprettet ${new Date(task.created_at || Date.now()).toLocaleDateString('nb-NO')}`}
        showThemeToggle={false}
        rightComponent={
          <Button
            variant="secondary"
            size="small"
            onPress={() => navigation.goBack()}
            disabled={saving}
          >
            Lukk
          </Button>
        }
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 📝 HELE FORMEN ER NÅ ÉN KOMPONENT! */}
        <TaskForm
          formData={formData}
          onFieldChange={updateField}
          errors={errors}
          showCompletedStatus={true}
          completed={completed}
          onCompletedChange={setCompleted}
          testID="edit-task-form"
        />
      </ScrollView>

      {/* 🚀 Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          variant="secondary"
          size="large"
          onPress={handleDeleteTask}
          disabled={saving}
          style={styles.deleteButton}
        >
          🗑️ Slett
        </Button>
        
        <Button
          variant="primary"
          size="large"
          onPress={handleSaveTask}
          disabled={saving}
          style={styles.saveButton}
        >
          {saving ? (
            <View style={styles.buttonContent}>
              <ActivityIndicator size="small" color="#fff" style={styles.spinner} />
              <Text variant="body1" style={{ color: '#fff', marginLeft: 8 }}>
                Lagrer...
              </Text>
            </View>
          ) : (
            '💾 Lagre endringer'
          )}
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
    gap: 12,
    paddingTop: 16,
  },
  deleteButton: {
    flex: 1,
  },
  saveButton: {
    flex: 2,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginRight: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    marginBottom: 12,
    textAlign: 'center',
  },
  errorSubtitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    paddingHorizontal: 32,
  },
});