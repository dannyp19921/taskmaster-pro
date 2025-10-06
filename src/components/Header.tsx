// /src/components/Header.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showThemeToggle?: boolean;
  rightComponent?: React.ReactNode;
  testID?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showThemeToggle = true,
  rightComponent,
  testID = "app-header",
}) => {
  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.titleContainer}>
        <Text variant="h3" color="primary">
          {title}
        </Text>
        {subtitle && (
          <Text variant="caption" color="secondary" style={styles.subtitle}>
            {subtitle}
          </Text>
        )}
      </View>
      
      <View style={styles.rightContainer}>
        {rightComponent}
        {showThemeToggle && <ThemeToggle />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20,
  },
  titleContainer: {
    flex: 1,
  },
  subtitle: {
    marginTop: 2,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});