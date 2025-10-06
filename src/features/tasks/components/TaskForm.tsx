// /src/features/tasks/components/TaskForm.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';

import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { Text } from '../../../components/Text';
import { DatePicker } from '../../../components/DatePicker';
import { PrioritySelector, Priority } from '../../../components/PrioritySelector';
import { CategorySelector } from '../../../components/CategorySelector';
import { useTheme } from '../../../core/theme';
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
      <Input
        label="Tittel *"
        value={formData.title}
        onChangeText={onFieldChange('title')}
        placeholder="Skriv inn oppgavetittel..."
        error={errors.title}
        testID={`${testID}-title`}
      />

      <Input
        label="Beskrivelse"
        value={formData.description}
        onChangeText={onFieldChange('description')}
        placeholder="Legg til detaljer om oppgaven (valgfritt)..."
        variant="textarea"
        hint="Detaljert beskrivelse hjelper deg å huske hva som må gjøres"
        testID={`${testID}-description`}
      />

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

      <PrioritySelector
        value={formData.priority}
        onPriorityChange={onFieldChange('priority') as (priority: Priority) => void}
        testID={`${testID}-priority`}
      />

      <CategorySelector
        value={formData.category}
        onCategoryChange={onFieldChange('category')}
        testID={`${testID}-category`}
      />

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
              alignSelf: 'flex-start',
              backgroundColor: completed ? theme.success : 'transparent',
              borderColor: theme.success,
            }}
            testID={`${testID}-status`}
          >
            {completed ? '✅ Fullført' : '⏳ Ikke fullført'}
          </Button>
        </View>
      )}

      <View style={[
        styles.summaryCard,
        {
          backgroundColor: theme.cardBackground, 
          borderColor: theme.border
        }
      ]}>
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