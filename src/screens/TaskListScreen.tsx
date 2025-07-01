// /src/screens/TaskListScreen.tsx: 

import { View, Text, FlatList, TouchableOpacity, Button } from 'react-native'; 

export default function TaskListScreen({ navigation }: any) {
    // Dummy tasks 
    const tasks = [
        {id: '1', title: 'Kjøpe melk', dueDate: '2025-07-03', priority: 'High'},
        {id: '2', title: 'Skrive rapport', dueDate: '2025-07-05', priority: 'Medium'}, 
        {id: '3', title: 'Vaske bilen', dueDate: '2025-07-10', priority: 'Low'}, 
    ];

    return (
        <View style={{ flex: 1, padding: 20}}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Mine oppgaver</Text>

            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={{
                            padding: 15,
                            borderWidth: 1, 
                            borderColor: '#ddd', 
                            borderRadius: 8, 
                            marginBottom: 10, 
                        }}
                    >
                        <Text style={{ fontSize: 18 }}>{item.title}</Text>
                        <Text style={{ color: '#666' }}>Frist: {item.dueDate}</Text>
                        <Text style={{ color: '#666' }}>Prioritet: {item.priority}</Text>
                    </TouchableOpacity>
                )}
            />

            <Button
                title="Opprett ny oppgave"
                onPress={() => navigation.navigate('CreateTask')}
            />
        </View>
    );
}