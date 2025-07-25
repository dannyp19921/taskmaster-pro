// /src/shared/ui/molecules/DatePicker.tsx - Modern date picker! 📅
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Input } from '../atoms/Input';
import { Text } from '../atoms/Text';
import { useTheme } from '../../../context/ThemeContext';

interface DatePickerProps {
  label?: string;
  value: string; // ISO date string (YYYY-MM-DD)
  onDateChange: (date: string) => void;
  error?: string;
  hint?: string;
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
  minimumDate,
  maximumDate,
  disabled = false,
  testID = "date-picker",
}) => {
  const { theme } = useTheme();
  const [showPicker, setShowPicker] = useState(false);

  // Convert ISO string to Date object
  const getDateFromValue = (): Date => {
    if (value) {
      const date = new Date(value);
      return isNaN(date.getTime()) ? new Date() : date;
    }
    return new Date();
  };

  // Format date for display
  const formatDisplayDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('nb-NO', options);
  };

  // Format date for ISO string (YYYY-MM-DD)
  const formatISODate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (selectedDate) {
      const isoString = formatISODate(selectedDate);
      onDateChange(isoString);
    }
  };

  const openPicker = () => {
    if (!disabled) {
      setShowPicker(true);
    }
  };

  const currentDate = getDateFromValue();
  const displayText = value ? formatDisplayDate(currentDate) : '';

  return (
    <View style={styles.container} testID={testID}>
      {label && (
        <Text variant="subtitle2" color="primary" style={styles.label}>
          {label}
        </Text>
      )}

      <TouchableOpacity
        onPress={openPicker}
        disabled={disabled}
        style={[
          styles.dateButton,
          {
            backgroundColor: disabled ? theme.background : theme.cardBackground,
            borderColor: error ? '#F44336' : theme.border,
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
          {displayText || 'Velg dato...'}
        </Text>
        
        <Text variant="body1" color="secondary" style={styles.chevron}>
          ▼
        </Text>
      </TouchableOpacity>

      {error && (
        <Text 
          variant="caption" 
          style={{
            marginTop: 4,
            fontWeight: '500',
            color: '#F44336'
          }}
        >
          {error}
        </Text>
      )}

      {hint && !error && (
        <Text 
          variant="caption" 
          color="secondary" 
          style={{ marginTop: 4 }}
        >
          {hint}
        </Text>
      )}

      {/* Date Picker Modal */}
      {showPicker && (
        <DateTimePicker
          value={currentDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          testID={`${testID}-modal`}
        />
      )}
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
  },
  dateButtonIcon: {
    marginRight: 12,
  },
  dateText: {
    flex: 1,
  },
  chevron: {
    fontSize: 10,
  },
});