// /src/components/Calendar.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Text } from './Text';
import { Button } from './Button';
import { useTheme } from '../core/theme';

interface CalendarProps {
  visible: boolean;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onClose: () => void;
  minimumDate?: Date;
  maximumDate?: Date;
  testID?: string;
}

export const Calendar: React.FC<CalendarProps> = ({
  visible,
  selectedDate,
  onDateSelect,
  onClose,
  minimumDate,
  maximumDate,
  testID = "calendar",
}) => {
  const { theme } = useTheme();
  const [currentDate, setCurrentDate] = useState(selectedDate);

  const isDateDisabled = (date: Date): boolean => {
    if (minimumDate && date < minimumDate) return true;
    if (maximumDate && date > maximumDate) return true;
    return false;
  };

  const renderCalendarContent = () => {
    const today = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
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
    
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(<View key={`empty-${i}`} style={styles.emptyDay} />);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const isDisabled = isDateDisabled(date);
      
      const dayButtonStyles = [
        styles.dayButton,
        isToday && [styles.todayButton, { backgroundColor: theme.info }],
        isSelected && [styles.selectedDayButton, { backgroundColor: theme.success }],
        isDisabled && styles.disabledDayButton
      ];

      const dayTextColor = isDisabled 
        ? theme.textTertiary 
        : (isToday || isSelected) 
          ? '#FFFFFF' 
          : theme.textPrimary;

      days.push(
        <TouchableOpacity
          key={day}
          style={dayButtonStyles}
          onPress={() => {
            if (!isDisabled) {
              onDateSelect(date);
            }
          }}
          disabled={isDisabled}
          testID={`${testID}-day-${day}`}
        >
          <Text 
            variant="body2"
            style={[
              styles.dayText,
              {
                color: dayTextColor,
                fontWeight: (isToday || isSelected) ? '600' : 'normal'
              }
            ]}
          >
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={[styles.calendarContainer, { backgroundColor: theme.cardBackground }]}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity
            onPress={() => {
              const prevMonth = new Date(currentDate);
              prevMonth.setMonth(prevMonth.getMonth() - 1);
              setCurrentDate(prevMonth);
            }}
            style={styles.navButton}
            testID={`${testID}-prev-month`}
          >
            <Text variant="h3" style={[styles.navButtonText, { color: theme.info }]}>
              ‹
            </Text>
          </TouchableOpacity>
          
          <Text 
            variant="h3" 
            style={[styles.monthYearText, { color: theme.textPrimary }]}
          >
            {monthNames[currentMonth]} {currentYear}
          </Text>
          
          <TouchableOpacity
            onPress={() => {
              const nextMonth = new Date(currentDate);
              nextMonth.setMonth(nextMonth.getMonth() + 1);
              setCurrentDate(nextMonth);
            }}
            style={styles.navButton}
            testID={`${testID}-next-month`}
          >
            <Text variant="h3" style={[styles.navButtonText, { color: theme.info }]}>
              ›
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.weekDaysRow}>
          {weekDays.map(day => (
            <Text 
              key={day} 
              variant="caption"
              color="secondary"
              style={styles.weekDayText}
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
            onPress={onClose}
            testID={`${testID}-close`}
          >
            Lukk
          </Button>
        </View>
      </View>
    );
  };

  if (!visible) return null;

  return (
    <Modal 
      visible={visible} 
      transparent 
      animationType="fade"
      testID={testID}
    >
      <View style={styles.calendarOverlay}>
        {renderCalendarContent()}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  calendarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  calendarContainer: {
    borderRadius: 12,
    padding: 20,
    maxWidth: 350,
    width: '100%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    padding: 10,
    minWidth: 44,
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: '600',
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
    paddingVertical: 8,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  emptyDay: {
    width: '14.28%',
    height: 44,
  },
  dayButton: {
    width: '14.28%',
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 1,
  },
  todayButton: {},
  selectedDayButton: {},
  disabledDayButton: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: 16,
    textAlign: 'center',
  },
  calendarButtons: {
    alignItems: 'center',
  },
});