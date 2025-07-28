// /src/screens/TaskDetailScreen.tsx - REFAKTORERT: Bruker useTasks hook! 🚀

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';

// 🎯 ENDRING: Bruker useTasks i stedet for direkte Supabase!
import { useTasks } from '../features/tasks/hooks/useTasks';
import { Task } from '../features/tasks/types/task.types';

// 🎨 UI components - Atomic design!
import { Button, Input, Text } from '../shared/ui';
import { DatePicker } from '../shared/ui/molecules/DatePicker';
import { Header } from '../shared/ui/organisms/Header';

// 🌐 Context & Utils
import { useTheme } from '../context/ThemeContext';
import { CATEGORY_OPTIONS } from '../shared/utils/categories';

export default function TaskDetailScreen({ navigation, route }: any) {
  const { theme } = useTheme();
  const { taskId } = route.params;

  // 🎯 ENDRING: Bruker useTasks hook i stedet for direkte Supabase
  const { tasks, updateTask, deleteTask, loading: tasksLoading } = useTasks();

  // 🎯 State management
  const [task, setTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    category: 'Personlig',
    completed: false,
  });
  
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 🎯 Form handlers
  const updateField = (field: keyof typeof formData) => (value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // 📡 ENDRING: Bruker tasks fra useTasks i stedet for separat fetch
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
          completed: foundTask.status === 'completed',
        });
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

  // 💾 ENDRING: Bruker updateTask fra useTasks hook
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
        status: formData.completed ? 'completed' : 'open',
      });

      if (success) {
        console.log('✅ Oppgave lagret via useTasks hook!');
        Alert.alert('Suksess', 'Endringer lagret!');
        navigation.goBack();
      }
      // Error handling gjøres automatisk i useTasks hook
    } finally {
      setSaving(false);
    }
  };

  // 🗑️ ENDRING: Bruker deleteTask fra useTasks hook
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
            // Error handling gjøres automatisk i useTasks hook
          }
        }
      ]
    );
  };

  // 🎨 Priority Button - reusable component
  const PriorityButton = ({ priority, label, color }: {
    priority: 'Low' | 'Medium' | 'High';
    label: string;
    color: string;
  }) => (
    <Button
      variant={formData.priority === priority ? 'primary' : 'secondary'}
      size="small"
      onPress={() => updateField('priority')(priority)}
      style={{
        flex: 1,
        marginHorizontal: 4,
        borderColor: color,
        backgroundColor: formData.priority === priority ? color : 'transparent'
      }}
    >
      {label}
    </Button>
  );

  // 🏷️ Category Button - reusable component
  const CategoryButton = ({ category }: { category: typeof CATEGORY_OPTIONS[0] }) => (
    <Button
      variant={formData.category === category.value ? 'primary' : 'secondary'}
      size="small"
      onPress={() => updateField('category')(category.value)}
      style={{
        marginRight: 8,
        marginBottom: 8,
        borderColor: category.color,
        backgroundColor: formData.category === category.value ? category.color : 'transparent'
      }}
    >
      {category.label}
    </Button>
  );

  // 🔄 ENDRING: Loading state fra useTasks hook
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

  // ❌ Error state - task ikke funnet i state
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
        {/* 📝 Title Input */}
        <Input
          label="Tittel *"
          value={formData.title}
          onChangeText={updateField('title')}
          placeholder="Skriv inn oppgavetittel..."
          error={errors.title}
          testID="task-title-input"
        />

        {/* 📄 Description Input */}
        <Input
          label="Beskrivelse"
          value={formData.description}
          onChangeText={updateField('description')}
          placeholder="Legg til detaljer om oppgaven (valgfritt)..."
          variant="textarea"
          hint="Detaljert beskrivelse hjelper deg å huske hva som må gjøres"
          testID="task-description-input"
        />

        {/* 📅 Due Date Picker - Using new DatePicker molecule! */}
        <DatePicker
          label="Forfallsdato *"
          value={formData.due_date}
          onDateChange={updateField('due_date')}
          error={errors.due_date}
          hint="Trykk for å åpne kalender"
          placeholder="Velg forfallsdato..."
          testID="task-due-date-picker"
        />

        {/* ⚡ Priority Selection */}
        <View style={styles.section}>
          <Text variant="subtitle2" color="primary" style={styles.sectionTitle}>
            Prioritet *
          </Text>
          <View style={styles.priorityButtons}>
            <PriorityButton priority="Low" label="🟢 Lav" color="#4CAF50" />
            <PriorityButton priority="Medium" label="🟡 Medium" color="#FF9800" />
            <PriorityButton priority="High" label="🔴 Høy" color="#F44336" />
          </View>
        </View>

        {/* 🏷️ Category Selection */}
        <View style={styles.section}>
          <Text variant="subtitle2" color="primary" style={styles.sectionTitle}>
            Kategori *
          </Text>
          <View style={styles.categoryButtons}>
            {CATEGORY_OPTIONS.map((category) => (
              <CategoryButton key={category.value} category={category} />
            ))}
          </View>
        </View>

        {/* ✅ Completion Status */}
        <View style={styles.section}>
          <Text variant="subtitle2" color="primary" style={styles.sectionTitle}>
            Status
          </Text>
          <Button
            variant={formData.completed ? 'primary' : 'secondary'}
            size="medium"
            onPress={() => updateField('completed')(!formData.completed)}
            style={{
              ...styles.statusButton,
              backgroundColor: formData.completed ? '#4CAF50' : 'transparent',
              borderColor: '#4CAF50',
            }}
          >
            {formData.completed ? '✅ Fullført' : '⏳ Ikke fullført'}
          </Button>
        </View>

        {/* 📊 Task Summary */}
        <View style={[styles.summaryCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <Text variant="subtitle2" color="primary" style={styles.summaryTitle}>
            📋 Oppgaveinformasjon
          </Text>
          <Text variant="body2" color="secondary">
            Status: {formData.completed ? 'Fullført' : 'Åpen'}
          </Text>
          <Text variant="body2" color="secondary">
            Prioritet: {formData.priority}
          </Text>
          <Text variant="body2" color="secondary">
            Kategori: {CATEGORY_OPTIONS.find(c => c.value === formData.category)?.label}
          </Text>
          <Text variant="body2" color="secondary">
            Opprettet: {new Date(task.created_at || Date.now()).toLocaleDateString('nb-NO')}
          </Text>
        </View>
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  priorityButtons: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statusButton: {
    alignSelf: 'flex-start',
  },
  summaryCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
  },
  summaryTitle: {
    marginBottom: 8,
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