// /src/shared/ui/molecules/SearchBox.tsx - Refaktorert med atomiske komponenter
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Input } from '../atoms/Input';
import { useTheme } from '../../../context/ThemeContext';

interface SearchBoxProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  disabled?: boolean;
  testID?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  value,
  onChangeText,
  placeholder = "🔍 Søk...",
  onClear,
  disabled = false,
  testID = "search-box",
}) => {
  const { theme } = useTheme();

  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
      <Input
        variant="search"
        size="medium"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        leftIcon="🔍"
        disabled={disabled}
        testID={testID}
      />
      {value.length > 0 && (
        <TouchableOpacity 
          style={styles.clearButton} 
          onPress={handleClear}
          testID={`${testID}-clear`}
        >
          <Text style={[styles.clearText, { color: theme.textSecondary }]}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    position: 'relative',
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 10,
  },
  clearText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default SearchBox;