// /src/screens/TaskDetailScreen.tsx - 100% PERFEKT ATOMIC DESIGN! 🎯

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';

// 🎯 Business logic
import { useTasks } from '../features/tasks/hooks/useTasks';
import { Task } from '../features/tasks/types/task.types';

// 🧪 Validation utilities - Shared with CreateTaskScreen!
import { validateTaskForm } from '../shared/utils/taskValidation';

// 🎨 UI components - Clean atomic design imports!
import { Button, Text } from '../shared/ui';
import { Header } from '../shared/ui/organisms/Header';
import { TaskForm, TaskFormData } from '../features/tasks/components/TaskForm';

// 🌐 Context
import { useTheme } from '../context/ThemeContext';

interface TaskDetailScreenProps {
  navigation: any;
  route: {
    params: {
      taskId: string;
    };
  };
}

export default function TaskDetailScreen({ navigation, route }: TaskDetailScreenProps) {
  const { theme } = useTheme();
  const { taskId } = route.params;
  const { tasks, updateTask, deleteTask, loading: tasksLoading } = useTasks();

  // 🎯 State management - Clean and consistent
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

  // 🎯 Form handler - Identical to CreateTaskScreen (DRY principle)
  const updateField = (field: keyof TaskFormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // 📡 Load task data from existing state - Optimized
  useEffect(() => {
    if (tasks.length > 0) {
      const foundTask = tasks.find(t => t.id === taskId);
      
      if (foundTask) {
        console.log('✅ Task loaded from state:', foundTask.title);
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
        console.log('❌ Task not found in state');
        Alert.alert('Feil', 'Oppgaven ble ikke funnet');
        navigation.goBack();
      }
    }
  }, [tasks, taskId, navigation]);

  // 💾 Save handler with shared validation
  const handleSaveTask = async () => {
    const validation = validateTaskForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      Alert.alert('Valideringsfeil', 'Vennligst rett opp feilene og prøv igjen');
      return;
    }

    try {
      setSaving(true);
      console.log('💾 Saving task changes:', taskId);

      const success = await updateTask(taskId, {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        due_date: formData.due_date,
        priority: formData.priority,
        category: formData.category,
        status: completed ? 'completed' : 'open',
      });

      if (success) {
        console.log('✅ Task saved successfully');
        Alert.alert('Suksess', 'Endringer lagret!');
        navigation.goBack();
      }
    } finally {
      setSaving(false);
    }
  };

  // 🗑️ Delete handler with confirmation
  const handleDeleteTask = async () => {
    Alert.alert(
      'Slett oppgave',
      `Er du sikker på at du vil slette "${task?.title}"?`,
      [
        { text: 'Avbryt', style: 'cancel' },
        { 
          text: 'Slett', 
          style: 'destructive', 
          onPress: async () => {
            const success = await deleteTask(taskId);
            
            if (success) {
              console.log('✅ Task deleted successfully');
              Alert.alert('Suksess', 'Oppgave slettet!');
              navigation.goBack();
            }
          }
        }
      ]
    );
  };

  // 🔄 Loading state - Consistent with other screens
  if (tasksLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.info} />
        <Text variant="body1" color="secondary" style={styles.loadingText}>
          Laster oppgave...
        </Text>
      </View>
    );
  }

  // ❌ Error state - Better error handling
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
          testID="back-button"
        >
          Gå tilbake
        </Button>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* 📱 Header - Consistent with CreateTaskScreen */}
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
            testID="close-button"
          >
            Lukk
          </Button>
        }
      />

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 📝 TaskForm - Same reusable component as CreateTaskScreen */}
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

      {/* 🚀 Action Buttons - Consistent styling and behavior */}
      <View style={styles.actionButtons}>
        <Button
          variant="secondary"
          size="large"
          onPress={handleDeleteTask}
          disabled={saving}
          style={styles.deleteButton}
          testID="delete-button"
        >
          🗑️ Slett
        </Button>
        
        <Button
          variant="primary"
          size="large"
          onPress={handleSaveTask}
          disabled={saving}
          style={styles.saveButton}
          testID="save-button"
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

// 🎨 Styles - Clean and consistent
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