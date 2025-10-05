// /src/screens/CreateTaskScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';

import { useTasks } from '../features/tasks/hooks/useTasks';
import { CreateTaskDto } from '../features/tasks/types/task.types';

import { validateTaskForm } from '../shared/utils/taskValidation';

import { Button } from '../shared/ui';
import { Header } from '../shared/ui/organisms/Header';
import { TaskForm, TaskFormData } from '../features/tasks/components/TaskForm';

import { useTheme } from '../context/ThemeContext';

export default function CreateTaskScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { createTask, creating } = useTasks();

  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    due_date: '',
    priority: 'Medium',
    category: 'Personlig',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: keyof TaskFormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

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
      navigation.navigate('TaskList');
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
      <Header 
        title="Ny oppgave"
        subtitle="Opprett en ny oppgave"
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
          testID="create-task-form"
        />
      </ScrollView>

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
          {creating ? 'Oppretter...' : 'Opprett oppgave'}
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
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});