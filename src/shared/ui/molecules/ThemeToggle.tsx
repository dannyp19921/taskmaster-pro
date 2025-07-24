// /src/components/ThemeToggle.tsx - Dark mode switch komponent

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, isDarkMode, toggleTheme } = useTheme();

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.cardBackground,
          borderColor: theme.border,
        }
      ]} 
      onPress={toggleTheme}
    >
      <View style={styles.content}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          {isDarkMode ? 'Mørkt tema' : 'Lyst tema'}
        </Text>
        
        <View style={[
          styles.switch, 
          { 
            backgroundColor: isDarkMode ? theme.info : theme.border 
          }
        ]}>
          <View style={[
            styles.switchThumb,
            {
              backgroundColor: theme.cardBackground,
              transform: [{ translateX: isDarkMode ? 24 : 2 }]
            }
          ]} />
        </View>
        
        <Text style={styles.icon}>
          {isDarkMode ? '🌙' : '☀️'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  switch: {
    width: 50,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    position: 'relative',
  },
  switchThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    position: 'absolute',
    elevation: 3,
  },
  icon: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
  },
});