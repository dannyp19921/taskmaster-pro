// /src/screens/CreateTaskScreen.tsx - 100% PERFEKT! 🎯

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';

// 🎯 Business logic
import { useTasks } from '../features/tasks/hooks/useTasks';
import { CreateTaskDto } from '../features/tasks/types/task.types';

// 🧪 Validation utilities - Felles for alle screens!
import { validateTaskForm } from '../shared/utils/taskValidation';

// 🎨 UI components - Perfect atomic design!
import { Button } from '../shared/ui';
import { Header } from '../shared/ui/organisms/Header';
import { TaskForm, TaskFormData } from '../features/tasks/components/TaskForm';

// 🌐 Context
import { useTheme } from '../context/ThemeContext';

export default function CreateTaskScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { createTask, creating } = useTasks();

  // 🎨 Form state - Clean and standardized
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    due_date: '',
    priority: 'Medium',
    category: 'Personlig',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 🎯 Form handler - Consistent across all forms
  const updateField = (field: keyof TaskFormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // 🧪 Validation using shared utility - DRY principle!
  const handleSubmit = async () => {
    const validation = validateTaskForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
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
      navigation.goBack();
    }
  };

  const handleCancel = () => {
    const hasChanges = formData.title.trim() || formData.description.trim();
    
    if (hasChanges) {
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

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* 📱 Header - Consistent across all screens */}
      <Header 
        title="Ny oppgave"
        subtitle="Opprett en ny oppgave"
        showThemeToggle={false}
        rightComponent={
          <Button
            variant="secondary"
            size="small"
            onPress={handleCancel}
            testID="cancel-button"
          >
            Avbryt
          </Button>
        }
      />

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 📝 TaskForm - Perfect reusable atomic component with molecules */}
        <TaskForm
          formData={formData}
          onFieldChange={updateField}
          errors={errors}
          testID="create-task-form"
        />
      </ScrollView>

      {/* 🚀 Action Buttons - Consistent styling and behavior */}
      <View style={styles.actionButtons}>
        <Button
          variant="secondary"
          size="large"
          onPress={handleCancel}
          style={styles.cancelButton}
          testID="cancel-action-button"
        >
          Avbryt
        </Button>
        
        <Button
          variant="primary"
          size="large"
          onPress={handleSubmit}
          disabled={creating}
          style={styles.submitButton}
          testID="submit-button"
        >
          {creating ? 'Oppretter...' : '✅ Opprett oppgave'}
        </Button>
      </View>
    </View>
  );
}

// 🎨 Styles - Clean and focused
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
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});