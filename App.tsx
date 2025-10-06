// App.tsx
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { ThemeProvider } from './src/core/theme';
import { supabase } from './src/core/api';
import { AppNavigator } from './src/navigation';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    checkUserSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(session !== null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const checkUserSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(session !== null);
    } catch (error) {
      console.error('Session check error:', error);
      setIsLoggedIn(false);
    }
  };

  if (isLoggedIn === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <NavigationContainer>
        <AppNavigator isLoggedIn={isLoggedIn} />
      </NavigationContainer>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});