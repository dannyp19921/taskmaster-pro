// /src/features/tasks/components/TaskForm.tsx - Gjenbrukbar task form! 📝

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Text, Button } from '../../../shared/ui';
import { DatePicker } from '../../../shared/ui/molecules/DatePicker';
import { PrioritySelector, Priority } from '../../../shared/ui/molecules/PrioritySelector';
import { CategorySelector } from '../../../shared/ui/molecules/CategorySelector';
import { useTheme } from '../../../context/ThemeContext';
import { CATEGORY_OPTIONS } from '../../../shared/utils/categories';

export interface TaskFormData {
  title: string;
  description: string;
  due_date: string;
  priority: Priority;
  category: string;
}

interface TaskFormProps {
  formData: TaskFormData;
  onFieldChange: (field: keyof TaskFormData) => (value: string) => void;
  errors: Record<string, string>;
  showCompletedStatus?: boolean;
  completed?: boolean;
  onCompletedChange?: (completed: boolean) => void;
  testID?: string;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  formData,
  onFieldChange,
  errors,
  showCompletedStatus = false,
  completed = false,
  onCompletedChange,
  testID = "task-form",
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container} testID={testID}>
      {/* 📝 Title Input */}
      <Input
        label="Tittel *"
        value={formData.title}
        onChangeText={onFieldChange('title')}
        placeholder="Skriv inn oppgavetittel..."
        error={errors.title}
        testID={`${testID}-title`}
      />

      {/* 📄 Description Input */}
      <Input
        label="Beskrivelse"
        value={formData.description}
        onChangeText={onFieldChange('description')}
        placeholder="Legg til detaljer om oppgaven (valgfritt)..."
        variant="textarea"
        hint="Detaljert beskrivelse hjelper deg å huske hva som må gjøres"
        testID={`${testID}-description`}
      />

      {/* 📅 Due Date Picker */}
      <DatePicker
        label="Forfallsdato *"
        value={formData.due_date}
        onDateChange={onFieldChange('due_date')}
        error={errors.due_date}
        hint="Trykk for å åpne kalender"
        placeholder="Velg forfallsdato..."
        minimumDate={new Date()}
        testID={`${testID}-due-date`}
      />

      {/* ⚡ Priority Selection */}
      <PrioritySelector
        value={formData.priority}
        onPriorityChange={onFieldChange('priority')}
        testID={`${testID}-priority`}
      />

      {/* 🏷️ Category Selection */}
      <CategorySelector
        value={formData.category}
        onCategoryChange={onFieldChange('category')}
        testID={`${testID}-category`}
      />

      {/* ✅ Completion Status (only for editing) */}
      {showCompletedStatus && onCompletedChange && (
        <View style={styles.section}>
          <Text variant="subtitle2" color="primary" style={styles.sectionTitle}>
            Status
          </Text>
          <Button
            variant={completed ? 'primary' : 'secondary'}
            size="medium"
            onPress={() => onCompletedChange(!completed)}
            style={{
              ...styles.statusButton,
              backgroundColor: completed ? '#4CAF50' : 'transparent',
              borderColor: '#4CAF50',
            }}
            testID={`${testID}-status`}
          >
            {completed ? '✅ Fullført' : '⏳ Ikke fullført'}
          </Button>
        </View>
      )}

      {/* 📊 Form Summary */}
      <View style={{
        ...styles.summaryCard,
        backgroundColor: theme.cardBackground, 
        borderColor: theme.border
      }}>
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
        {showCompletedStatus && (
          <Text variant="body2" color="secondary">
            Status: {completed ? 'Fullført' : 'Åpen'}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 8,
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
});