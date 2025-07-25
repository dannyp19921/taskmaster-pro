// /src/shared/ui/molecules/DatePicker.tsx - Modern date picker med custom calendar! 📅
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '../atoms/Text';
import { Calendar } from './Calendar';
import { useTheme } from '../../../context/ThemeContext';

interface DatePickerProps {
  label?: string;
  value: string; // ISO date string (YYYY-MM-DD)
  onDateChange: (date: string) => void;
  error?: string;
  hint?: string;
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  disabled?: boolean;
  testID?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onDateChange,
  error,
  hint,
  placeholder = "Velg dato...",
  minimumDate,
  maximumDate,
  disabled = false,
  testID = "date-picker",
}) => {
  const { theme } = useTheme();
  const [showCalendar, setShowCalendar] = useState(false);

  // Convert ISO string (YYYY-MM-DD) to Date object
  const getDateFromValue = (): Date => {
    if (value) {
      const date = new Date(value + 'T12:00:00'); // Add time to avoid timezone issues
      return isNaN(date.getTime()) ? new Date() : date;
    }
    return new Date();
  };

  // Format date for display (Norwegian format)
  const formatDisplayDate = (dateString: string): string => {
    if (!dateString) return '';
    
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
  };

  // Format date for ISO string (YYYY-MM-DD)
  const formatISODate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateSelect = (date: Date) => {
    const isoString = formatISODate(date);
    onDateChange(isoString);
    setShowCalendar(false);
  };

  const openCalendar = () => {
    if (!disabled) {
      setShowCalendar(true);
    }
  };

  const displayText = value ? formatDisplayDate(value) : '';

  return (
    <View style={styles.container} testID={testID}>
      {label && (
        <Text variant="subtitle2" color="primary" style={styles.label}>
          {label}
        </Text>
      )}

      <TouchableOpacity
        onPress={openCalendar}
        disabled={disabled}
        style={[
          styles.dateButton,
          {
            backgroundColor: disabled ? theme.background : theme.cardBackground,
            borderColor: error ? '#F44336' : theme.border,
            opacity: disabled ? 0.6 : 1,
          }
        ]}
        testID={`${testID}-button`}
      >
        <Text variant="body1" style={styles.dateButtonIcon}>
          📅
        </Text>
        
        <Text 
          variant="body1" 
          color={value ? 'primary' : 'secondary'}
          style={styles.dateText}
        >
          {displayText || placeholder}
        </Text>
        
        <Text variant="body1" color="secondary" style={styles.chevron}>
          ▼
        </Text>
      </TouchableOpacity>

      {error && (
        <Text 
          variant="caption" 
          style={{ ...styles.errorText, color: '#F44336' }}
        >
          {error}
        </Text>
      )}

      {hint && !error && (
        <Text 
          variant="caption" 
          color="secondary" 
          style={styles.hintText}
        >
          {hint}
        </Text>
      )}

      {/* Calendar Modal */}
      <Calendar
        visible={showCalendar}
        selectedDate={getDateFromValue()}
        onDateSelect={handleDateSelect}
        onClose={() => setShowCalendar(false)}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        testID={`${testID}-calendar`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 48,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dateButtonIcon: {
    marginRight: 12,
    fontSize: 18,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
  },
  chevron: {
    fontSize: 10,
    opacity: 0.6,
  },
  errorText: {
    marginTop: 4,
    fontWeight: '500',
  },
  hintText: {
    marginTop: 4,
  },
});