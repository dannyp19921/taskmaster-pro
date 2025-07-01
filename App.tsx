// App.tsx: 

import { NavigationContainer } from '@react-navigation/native'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen'; 
import RegisterScreen from './src/screens/RegisterScreen';
import TaskListScreen from './src/screens/TaskListScreen';
import CreateTaskScreen from './src/screens/CreateTaskScreen';

export default function App() {
  const Stack = createNativeStackNavigator(); 

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="TaskList" component={TaskListScreen} />
        <Stack.Screen name="CreateTask" component={CreateTaskScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


/* import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Velkommen til TaskMaster Pro!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
 */