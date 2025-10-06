// App.tsx
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import { supabase } from './src/services/supabase';

import LoginScreen from './src/screens/LoginScreen'; 
import RegisterScreen from './src/screens/RegisterScreen';
import TaskListScreen from './src/screens/TaskListScreen';
import CreateTaskScreen from './src/screens/CreateTaskScreen';
import TaskDetailScreen from './src/screens/TaskDetailScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import { ThemeProvider } from './src/context/ThemeContext';

const Stack = createNativeStackNavigator();

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
        <Stack.Navigator 
          initialRouteName={isLoggedIn ? "TaskList" : "Login"}
          screenOptions={{ headerShown: false }}
        >
          {isLoggedIn ? (
            <>
              <Stack.Screen name="TaskList" component={TaskListScreen} />
              <Stack.Screen name="CreateTask" component={CreateTaskScreen} />
              <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
              <Stack.Screen name="Dashboard" component={DashboardScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          )}
        </Stack.Navigator>
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