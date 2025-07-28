// /src/shared/ui/molecules/ValidationErrorDisplay.tsx - Form validation errors! ✋

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '../atoms/Text';
import { useTheme } from '../../../context/ThemeContext';

interface ValidationError {
  field: string;
  message: string;
  severity?: 'error' | 'warning' | 'info';
}

interface ValidationErrorDisplayProps {
  errors: ValidationError[];
  onDismiss?: () => void;
  showSummary?: boolean;
  maxVisible?: number;
  testID?: string;
}

export const ValidationErrorDisplay: React.FC<ValidationErrorDisplayProps> = ({
  errors,
  onDismiss,
  showSummary = true,
  maxVisible = 5,
  testID = "validation-error-display",
}) => {
  const { theme } = useTheme();

  if (!errors || errors.length === 0) {
    return null;
  }

  // 🎯 Group errors by severity
  const errorsByType = {
    error: errors.filter(e => e.severity === 'error' || !e.severity),
    warning: errors.filter(e => e.severity === 'warning'),
    info: errors.filter(e => e.severity === 'info'),
  };

  const hasErrors = errorsByType.error.length > 0;
  const hasWarnings = errorsByType.warning.length > 0;
  const hasInfo = errorsByType.info.length > 0;

  // 🎨 Get severity styling
  const getSeverityStyles = (severity: 'error' | 'warning' | 'info') => {
    switch (severity) {
      case 'error':
        return {
          icon: '🚨',
          color: '#F44336',
          backgroundColor: '#FFEBEE',
          borderColor: '#FFCDD2',
        };
      case 'warning':
        return {
          icon: '⚠️',
          color: '#FF9800',
          backgroundColor: '#FFF8E1',
          borderColor: '#FFECB3',
        };
      case 'info':
        return {
          icon: 'ℹ️',
          color: '#2196F3',
          backgroundColor: '#E3F2FD',
          borderColor: '#BBDEFB',
        };
    }
  };

  // 📋 Render error list
  const renderErrorList = (errorList: ValidationError[], severity: 'error' | 'warning' | 'info') => {
    if (errorList.length === 0) return null;

    const styles_severity = getSeverityStyles(severity);
    const visibleErrors = errorList.slice(0, maxVisible);
    const hiddenCount = errorList.length - maxVisible;

    return (
      <View key={severity} style={[
        styles.errorSection,
        {
          backgroundColor: styles_severity.backgroundColor,
          borderColor: styles_severity.borderColor,
        }
      ]}>
        {/* Section header */}
        <View style={styles.sectionHeader}>
          <Text variant="caption" style={{ color: styles_severity.color, fontWeight: '600' }}>
            {styles_severity.icon} {severity.toUpperCase()} ({errorList.length})
          </Text>
          
          {onDismiss && (
            <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
              <Text variant="caption" style={{ color: styles_severity.color }}>
                ✕
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Error items */}
        {visibleErrors.map((error, index) => (
          <View key={`${error.field}-${index}`} style={styles.errorItem}>
            <Text variant="caption" style={{ color: styles_severity.color, fontWeight: '500' }}>
              {error.field}:
            </Text>
            <Text variant="caption" style={{ color: styles_severity.color, marginLeft: 8 }}>
              {error.message}
            </Text>
          </View>
        ))}

        {/* Show hidden count */}
        {hiddenCount > 0 && (
          <Text variant="caption" style={{ color: styles_severity.color, fontStyle: 'italic', marginTop: 4 }}>
            ... og {hiddenCount} flere
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container} testID={testID}>
      {/* 📊 Summary (if enabled) */}
      {showSummary && (
        <View style={[
          styles.summary,
          { 
            backgroundColor: hasErrors ? '#FFEBEE' : '#FFF8E1',
            borderColor: hasErrors ? '#FFCDD2' : '#FFECB3',
          }
        ]}>
          <Text variant="body2" style={{ 
            color: hasErrors ? '#F44336' : '#FF9800', 
            fontWeight: '600' 
          }}>
            {hasErrors ? '🚨' : '⚠️'} {errors.length} valideringsfeil funnet
          </Text>
          <Text variant="caption" style={{ 
            color: hasErrors ? '#F44336' : '#FF9800',
            marginTop: 4,
          }}>
            Vennligst rett opp feilene under før du fortsetter
          </Text>
        </View>
      )}

      {/* 📋 Error lists by severity */}
      {renderErrorList(errorsByType.error, 'error')}
      {renderErrorList(errorsByType.warning, 'warning')}
      {renderErrorList(errorsByType.info, 'info')}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  summary: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  errorSection: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dismissButton: {
    padding: 4,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
  },
  errorItem: {
    flexDirection: 'row',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
});