// App.tsx

import { NavigationContainer } from '@react-navigation/native'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen'; 
import RegisterScreen from './src/screens/RegisterScreen';
import TaskListScreen from './src/screens/TaskListScreen';
import CreateTaskScreen from './src/screens/CreateTaskScreen';
import TaskDetailScreen from './src/screens/TaskDetailScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import { ThemeProvider } from './src/context/ThemeContext';

export default function App() {
  const Stack = createNativeStackNavigator(); 

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">

          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="TaskList" component={TaskListScreen} />
          <Stack.Screen name="CreateTask" component={CreateTaskScreen} />
          <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  )
}