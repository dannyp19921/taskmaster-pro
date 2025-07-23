// /src/screens/TaskDetailScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { supabase } from '../services/supabase';

interface Task {
  id: string;
  title: string;
  due_date: string;
  priority: string;
  status: string;
  user_id: string;
}

export default function TaskDetailScreen({ navigation, route }: any) {
  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [saving, setSaving] = useState(false); // Loading state for save button

  const { taskId } = route.params;

  // Formatter dato til YYYY-MM-DD (lokal tid, ikke UTC)
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Formatter dato til visning (norsk format)
  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return '';
    
    // Parse YYYY-MM-DD string til lokale dato-komponenter
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
  };

  // Enkel dato-validering
  const isValidDate = (dateString: string) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime()) && dateString.match(/^\d{4}-\d{2}-\d{2}$/);
  };

  // Hent oppgave når skjermen lastes
  useEffect(() => {
    fetchTask();
  }, []);

  const fetchTask = async () => {
    console.log('📡 Henter oppgave med ID:', taskId);

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (error) {
        console.log('❌ Feil ved henting av oppgave:', error.message);
        alert('Kunne ikke hente oppgaven');
        navigation.goBack();
        return;
      }

      console.log('✅ Oppgave hentet:', data);
      setTask(data);
      setTitle(data.title);
      setDueDate(data.due_date);
      setPriority(data.priority);
      setCompleted(data.status === 'completed');
      
      // Sett selectedDate basert på oppgavens due_date
      if (data.due_date) {
        setSelectedDate(new Date(data.due_date));
      }
    } catch (error) {
      console.log('💥 Uventet feil:', error);
      alert('En uventet feil oppstod');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTask = async () => {
    console.log('💾 LAGRE ENDRINGER TRYKKET');

    // Validering
    if (!title.trim()) {
      alert('Tittel kan ikke være tom');
      return;
    }

    if (!dueDate) {
      alert('Frist må velges');
      return;
    }

    try {
      setSaving(true); // Start loading
      console.log('💾 Lagrer endringer for oppgave:', taskId);

      const { error } = await supabase
        .from('tasks')
        .update({
          title: title.trim(),
          due_date: dueDate,
          priority: priority,
          status: completed ? 'completed' : 'open',
        })
        .eq('id', taskId);

      if (error) {
        console.log('❌ Kunne ikke lagre:', error.message);
        alert('Kunne ikke lagre endringene: ' + error.message);
        return;
      }

      console.log('✅ Oppgave lagret!');
      alert('Endringer lagret!');
      navigation.goBack();
    } catch (error) {
      console.log('💥 Uventet feil ved lagring:', error);
      alert('En uventet feil oppstod');
    } finally {
      setSaving(false); // Stop loading
    }
  };

  const handleDeleteTask = async () => {
    const shouldDelete = confirm('Er du sikker på at du vil slette denne oppgaven?');
    
    if (!shouldDelete) {
      return;
    }

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) {
        console.log('❌ Kunne ikke slette:', error.message);
        alert('Kunne ikke slette oppgaven: ' + error.message);
        return;
      }

      console.log('✅ Oppgave slettet!');
      alert('Oppgave slettet!');
      navigation.goBack();
    } catch (error) {
      console.log('💥 Uventet feil ved sletting:', error);
      alert('En uventet feil oppstod');
    }
  };

  // Prioritet dropdown
  const renderPriorityPicker = () => (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity 
        style={styles.dropdownButton}
        onPress={() => setShowPriorityPicker(!showPriorityPicker)}
      >
        <Text style={styles.dropdownButtonText}>
          {priority === 'High' ? '🔴 Høy' : 
           priority === 'Medium' ? '🟡 Medium' : 
           '🟢 Lav'}
        </Text>
        <Text style={styles.dropdownArrow}>
          {showPriorityPicker ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {showPriorityPicker && (
        <View style={styles.dropdownOptions}>
          <TouchableOpacity
            style={[styles.dropdownOption, priority === 'High' && styles.dropdownOptionActive]}
            onPress={() => {
              setPriority('High');
              setShowPriorityPicker(false);
            }}
          >
            <Text style={[styles.dropdownOptionText, priority === 'High' && styles.dropdownOptionTextActive]}>
              🔴 Høy
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dropdownOption, priority === 'Medium' && styles.dropdownOptionActive]}
            onPress={() => {
              setPriority('Medium');
              setShowPriorityPicker(false);
            }}
          >
            <Text style={[styles.dropdownOptionText, priority === 'Medium' && styles.dropdownOptionTextActive]}>
              🟡 Medium
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dropdownOption, { borderBottomWidth: 0 }, priority === 'Low' && styles.dropdownOptionActive]}
            onPress={() => {
              setPriority('Low');
              setShowPriorityPicker(false);
            }}
          >
            <Text style={[styles.dropdownOptionText, priority === 'Low' && styles.dropdownOptionTextActive]}>
              🟢 Lav
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  // Kalender-komponent (samme som i CreateTaskScreen)
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
    
    // Tomme celler før månedens start
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(<View key={`empty-${i}`} style={styles.emptyDay} />);
    }
    
    // Dager i måneden
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
              setDueDate(formatDate(date));
              setShowCalendar(false);
            }
          }}
          disabled={isPast}
        >
          <Text style={[
            styles.dayText,
            isToday && styles.todayText,
            isSelected && styles.selectedDayText,
            isPast && styles.pastDayText
          ]}>
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
              
              <Text style={styles.monthYearText}>
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
                <Text key={day} style={styles.weekDayText}>{day}</Text>
              ))}
            </View>
            
            <View style={styles.calendarGrid}>
              {days}
            </View>
            
            <View style={styles.calendarButtons}>
              <TouchableOpacity 
                style={styles.cancelCalendarButton}
                onPress={() => setShowCalendar(false)}
              >
                <Text style={styles.cancelCalendarText}>Avbryt</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Laster oppgave...</Text>
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.errorContainer}>
        <Text>Oppgaven ble ikke funnet</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Gå tilbake</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Rediger oppgave</Text>

      {/* Tittel input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tittel *</Text>
        <TextInput
          placeholder="Skriv inn tittel..."
          value={title}
          onChangeText={setTitle}
          style={styles.textInput}
        />
      </View>

      {/* Dato picker med kalender */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Frist *</Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowCalendar(true)}
        >
          <Text style={styles.datePickerText}>
            {dueDate ? formatDateDisplay(dueDate) : 'Velg dato'}
          </Text>
          <Text style={styles.calendarIcon}>📅</Text>
        </TouchableOpacity>
        <Text style={styles.helpText}>
          Trykk for å åpne kalender
        </Text>
      </View>

      {/* Prioritet dropdown */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Prioritet *</Text>
        {renderPriorityPicker()}
      </View>

      {/* Completed checkbox */}
      <View style={styles.inputContainer}>
        <TouchableOpacity 
          style={styles.statusToggle}
          onPress={() => setCompleted(!completed)}
        >
          <View style={[styles.checkbox, completed && styles.checkboxChecked]}>
            {completed && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.statusText}>
            {completed ? 'Oppgave fullført' : 'Oppgave ikke fullført'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Action knapper */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.saveButton, saving && styles.buttonLoading]} 
          onPress={handleSaveTask}
          disabled={saving}
        >
          {saving ? (
            <View style={styles.buttonContent}>
              <ActivityIndicator size="small" color="#fff" style={styles.spinner} />
              <Text style={styles.buttonText}>Lagrer...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Lagre endringer</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.deleteButton, saving && styles.buttonDisabled]} 
          onPress={handleDeleteTask}
          disabled={saving}
        >
          <Text style={styles.buttonText}>Slett oppgave</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.cancelButton, saving && styles.buttonDisabled]} 
          onPress={() => navigation.goBack()}
          disabled={saving}
        >
          <Text style={[styles.cancelButtonText, saving && styles.disabledText]}>
            Avbryt
          </Text>
        </TouchableOpacity>
      </View>

      {/* Kalender modal */}
      {renderCalendar()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    elevation: 2,
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  dropdownContainer: {
    marginBottom: 10,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownArrow: {
    fontSize: 14,
    color: '#666',
  },
  dropdownOptions: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    elevation: 5,
    marginTop: -1,
  },
  dropdownOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownOptionActive: {
    backgroundColor: '#007AFF',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownOptionTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  statusToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    elevation: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 30,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Kalender styling (samme som CreateTaskScreen)
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
  calendarIcon: {
    fontSize: 18,
  },
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
  monthYearText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    paddingVertical: 5,
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
  dayText: {
    fontSize: 16,
    color: '#333',
  },
  todayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pastDayText: {
    color: '#ccc',
  },
  calendarButtons: {
    marginTop: 20,
    alignItems: 'center',
  },
  cancelCalendarButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  cancelCalendarText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  // Loading states styling
  buttonLoading: {
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginRight: 8,
  },
  disabledText: {
    color: '#999',
  },
});