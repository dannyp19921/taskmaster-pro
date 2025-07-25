// /src/screens/CreateTaskScreen.tsx - Clean architecture med DatePicker molekyl! 🚀

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';

// 🎯 Modern imports - SUPER Clean!
import { useCreateTask } from '../features/tasks/hooks/useCreateTask';
import { CreateTaskDto } from '../features/tasks/types/task.types';

// 🎨 UI components - Perfect atomic design!
import { Button, Input, Text } from '../shared/ui';
import { DatePicker } from '../shared/ui/molecules/DatePicker';
import { Header } from '../shared/ui/organisms/Header';

// 🌐 Context & Utils
import { useTheme } from '../context/ThemeContext';
import { CATEGORY_OPTIONS } from '../shared/utils/categories';

export default function CreateTaskScreen({ navigation }: any) {
  const { theme } = useTheme();
  
  // 🎯 Custom hook for business logic!
  const { createTask, loading, error, resetError } = useCreateTask();

  // 🎨 Form state - clean and simple
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    category: 'Personlig',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 🎯 Form handlers - super clean!
  const updateField = (field: keyof typeof formData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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

  const handleSubmit = async () => {
    resetError();
    
    if (!validateForm()) {
      Alert.alert('Valideringsfeil', 'Vennligst rett opp feilene og prøv igjen');
      return;
    }

    const taskData: CreateTaskDto = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      due_date: formData.due_date,
      priority: formData.priority,
      category: formData.category,
    };

    const createdTask = await createTask(taskData);
    
    if (createdTask) {
      // Success! Navigate back
      navigation.goBack();
    }
  };

  const handleCancel = () => {
    if (formData.title.trim() || formData.description.trim()) {
      Alert.alert(
        'Avbryt opprettelse?',
        'Du har ulagrede endringer. Er du sikker på at du vil avbryte?',
        [
          { text: 'Fortsett redigering', style: 'cancel' },
          { text: 'Avbryt', style: 'destructive', onPress: () => navigation.goBack() }
        ]
      );
    } else {
      navigation.goBack();
    }
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

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* 📱 Header - Using organism! */}
      <Header 
        title="Ny oppgave"
        subtitle="Opprett en ny oppgave"
        showThemeToggle={false}
        rightComponent={
          <Button
            variant="secondary"
            size="small"
            onPress={handleCancel}
          >
            Avbryt
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
          minimumDate={new Date()} // Can't select past dates
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

        {/* 📊 Form Summary */}
        <View style={[styles.summaryCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <Text variant="subtitle2" color="primary" style={styles.summaryTitle}>
            📋 Oppsummering
          </Text>
          <Text variant="body2" color="secondary">
            Tittel: {formData.title || 'Ikke angitt'}
          </Text>
          <Text variant="body2" color="secondary">
            Forfallsdato: {formData.due_date || 'Ikke angitt'}
          </Text>
          <Text variant="body2" color="secondary">
            Prioritet: {formData.priority}
          </Text>
          <Text variant="body2" color="secondary">
            Kategori: {CATEGORY_OPTIONS.find(c => c.value === formData.category)?.label}
          </Text>
        </View>
      </ScrollView>

      {/* 🚀 Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          variant="secondary"
          size="large"
          onPress={handleCancel}
          style={styles.cancelButton}
        >
          Avbryt
        </Button>
        
        <Button
          variant="primary"
          size="large"
          onPress={handleSubmit}
          disabled={loading}
          style={styles.submitButton}
        >
          {loading ? 'Oppretter...' : '✅ Opprett oppgave'}
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
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});