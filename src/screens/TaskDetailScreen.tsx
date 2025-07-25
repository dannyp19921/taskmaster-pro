// /src/screens/TaskDetailScreen.tsx - Clean architecture med DatePicker! 🚀

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';

// 🎯 Services & Types
import { supabase } from '../services/supabase';

// 🎨 UI components - Atomic design!
import { Button, Input, Text } from '../shared/ui';
import { DatePicker } from '../shared/ui/molecules/DatePicker';
import { Header } from '../shared/ui/organisms/Header';

// 🌐 Context & Utils
import { useTheme } from '../context/ThemeContext';
import { CATEGORY_OPTIONS } from '../shared/utils/categories';

interface Task {
  id: string;
  title: string;
  description?: string;
  due_date: string;
  priority: string;
  category: string;
  status: string;
  user_id: string;
  created_at?: string; // Optional since it might not always be present
}

export default function TaskDetailScreen({ navigation, route }: any) {
  const { theme } = useTheme();
  const { taskId } = route.params;

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
  
  const [loading, setLoading] = useState(true);
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

  // 📡 Fetch task data
  useEffect(() => {
    fetchTask();
  }, []);

  const fetchTask = async () => {
    console.log('📡 Henter oppgave med ID:', taskId);

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('id, title, description, due_date, priority, category, status, user_id, created_at')
        .eq('id', taskId)
        .single();

      if (error) {
        console.log('❌ Feil ved henting av oppgave:', error.message);
        Alert.alert('Feil', 'Kunne ikke hente oppgaven');
        navigation.goBack();
        return;
      }

      console.log('✅ Oppgave hentet:', data);
      setTask(data);
      setFormData({
        title: data.title,
        description: data.description || '',
        due_date: data.due_date,
        priority: data.priority,
        category: data.category || 'Personlig',
        completed: data.status === 'completed',
      });
    } catch (error) {
      console.log('💥 Uventet feil:', error);
      Alert.alert('Feil', 'En uventet feil oppstod');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

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

      const { error } = await supabase
        .from('tasks')
        .update({
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          due_date: formData.due_date,
          priority: formData.priority,
          category: formData.category,
          status: formData.completed ? 'completed' : 'open',
        })
        .eq('id', taskId);

      if (error) {
        console.log('❌ Kunne ikke lagre:', error.message);
        Alert.alert('Feil', 'Kunne ikke lagre endringene: ' + error.message);
        return;
      }

      console.log('✅ Oppgave lagret!');
      Alert.alert('Suksess', 'Endringer lagret!');
      navigation.goBack();
    } catch (error) {
      console.log('💥 Uventet feil ved lagring:', error);
      Alert.alert('Feil', 'En uventet feil oppstod');
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
            try {
              const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', taskId);

              if (error) {
                console.log('❌ Kunne ikke slette:', error.message);
                Alert.alert('Feil', 'Kunne ikke slette oppgaven: ' + error.message);
                return;
              }

              console.log('✅ Oppgave slettet!');
              Alert.alert('Suksess', 'Oppgave slettet!');
              navigation.goBack();
            } catch (error) {
              console.log('💥 Uventet feil ved sletting:', error);
              Alert.alert('Feil', 'En uventet feil oppstod');
            }
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

  // 🔄 Loading state
  if (loading) {
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
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    paddingHorizontal: 32,
  },
});