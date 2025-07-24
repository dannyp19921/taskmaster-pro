// /src/components/SearchBox.tsx - Modulær søke-komponent

import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

interface SearchBoxProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBox({ 
  value, 
  onChangeText, 
  placeholder = "🔍 Søk..." 
}: SearchBoxProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input, 
          { 
            backgroundColor: theme.cardBackground,
            borderColor: theme.border,
            color: theme.textPrimary 
          }
        ]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={theme.textTertiary}
      />
      {value.length > 0 && (
        <TouchableOpacity 
          style={[styles.clearButton, { backgroundColor: theme.textTertiary }]}
          onPress={() => onChangeText('')}
        >
          <Text style={styles.clearText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: 15,
  },
  input: {
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    elevation: 2,
    paddingRight: 45,
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});