// /src/screens/CreateTaskScreen.tsx - 100% moderne arkitektur med konsistent kalender! 🚀

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Modal, TouchableOpacity } from 'react-native';

// 🎯 Modern imports - SUPER Clean!
import { useCreateTask } from '../features/tasks/hooks/useCreateTask';
import { CreateTaskDto } from '../features/tasks/types/task.types';

// 🎨 UI components - Perfect atomic design!
import { Button, Input, Text } from '../shared/ui';
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
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  // 📅 Date formatting functions (same as TaskDetailScreen)
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
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

  // 📅 Calendar component (same as TaskDetailScreen)
  const renderCalendar = () => {
    const today = new Date();
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    const monthNames = [
      'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    const weekDays = ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'];
    
    const days = [];
    
    // Empty cells before month start
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(<View key={`empty-${i}`} style={styles.emptyDay} />);
    }
    
    // Days in month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const isPast = date < today && !isToday;
      
      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayButton,
            isToday && styles.todayButton,
            isSelected && styles.selectedDayButton,
            isPast && styles.pastDayButton
          ]}
          onPress={() => {
            if (!isPast) {
              setSelectedDate(date);
              updateField('due_date')(formatDate(date));
              setShowCalendar(false);
            }
          }}
          disabled={isPast}
        >
          <Text style={{
            fontSize: 16,
            color: isPast ? '#ccc' : (isToday || isSelected) ? '#fff' : '#333',
            fontWeight: (isToday || isSelected) ? 'bold' : 'normal'
          }}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    }
    
    return (
      <Modal visible={showCalendar} transparent animationType="fade">
        <View style={styles.calendarOverlay}>
          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity
                onPress={() => {
                  const prevMonth = new Date(selectedDate);
                  prevMonth.setMonth(prevMonth.getMonth() - 1);
                  setSelectedDate(prevMonth);
                }}
                style={styles.navButton}
              >
                <Text style={styles.navButtonText}>‹</Text>
              </TouchableOpacity>
              
              <Text style={{
                fontSize: 18,
                fontWeight: '600',
                color: theme.textPrimary
              }}>
                {monthNames[currentMonth]} {currentYear}
              </Text>
              
              <TouchableOpacity
                onPress={() => {
                  const nextMonth = new Date(selectedDate);
                  nextMonth.setMonth(nextMonth.getMonth() + 1);
                  setSelectedDate(nextMonth);
                }}
                style={styles.navButton}
              >
                <Text style={styles.navButtonText}>›</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.weekDaysRow}>
              {weekDays.map(day => (
                <Text 
                  key={day} 
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    fontSize: 12,
                    fontWeight: '600',
                    color: '#666',
                    paddingVertical: 5,
                  }}
                >
                  {day}
                </Text>
              ))}
            </View>
            
            <View style={styles.calendarGrid}>
              {days}
            </View>
            
            <View style={styles.calendarButtons}>
              <Button
                variant="secondary"
                size="medium"
                onPress={() => setShowCalendar(false)}
              >
                Avbryt
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

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

        {/* 📅 Due Date Picker - Same calendar as TaskDetail! */}
        <View style={styles.section}>
          <Text variant="subtitle2" color="primary" style={styles.sectionTitle}>
            Forfallsdato *
          </Text>
          
          <TouchableOpacity
            style={[styles.datePickerButton, { 
              backgroundColor: theme.cardBackground,
              borderColor: errors.due_date ? '#F44336' : theme.border
            }]}
            onPress={() => setShowCalendar(true)}
          >
            <Text style={{
              fontSize: 16,
              color: theme.textPrimary
            }}>
              {formData.due_date ? formatDateDisplay(formData.due_date) : 'Velg dato'}
            </Text>
            <Text style={styles.calendarIcon}>📅</Text>
          </TouchableOpacity>
          
          {errors.due_date && (
            <Text style={{
              fontSize: 12,
              marginTop: 4,
              fontWeight: '500',
              color: '#F44336'
            }}>
              {errors.due_date}
            </Text>
          )}
          
          <Text style={{
            fontSize: 12,
            marginTop: 4,
            color: theme.textSecondary
          }}>
            Trykk for å åpne kalender
          </Text>
        </View>

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

      {/* 📅 Calendar Modal - Same as TaskDetail */}
      {renderCalendar()}
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
  datePickerButton: {
    borderWidth: 1,
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  datePickerText: {
    fontSize: 16,
  },
  calendarIcon: {
    fontSize: 18,
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
  // Calendar styles (same as TaskDetailScreen)
  calendarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    maxWidth: 350,
    elevation: 10,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    padding: 10,
  },
  navButtonText: {
    fontSize: 24,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyDay: {
    width: '14.28%',
    height: 40,
  },
  dayButton: {
    width: '14.28%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  todayButton: {
    backgroundColor: '#007AFF',
  },
  selectedDayButton: {
    backgroundColor: '#4CAF50',
  },
  pastDayButton: {
    opacity: 0.3,
  },
  calendarButtons: {
    marginTop: 20,
    alignItems: 'center',
  },
});