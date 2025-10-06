// src/navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TaskListScreen from '../screens/TaskListScreen';
import CreateTaskScreen from '../screens/CreateTaskScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import DashboardScreen from '../screens/DashboardScreen';

const Stack = createNativeStackNavigator();

interface AppNavigatorProps {
  isLoggedIn: boolean;
}

export const AppNavigator: React.FC<AppNavigatorProps> = ({ isLoggedIn }) => {
  return (
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
  );
};