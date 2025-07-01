// /src/screens/CreateTaskScreen.tsx: 

import { View, Text, TextInput, Button } from 'react-native'; 
import { useState } from 'react'; 
import { supabase } from '../services/supabase'; 

export default function CreateTaskScreen({ navigation }: any) {
    const [title, setTitle] = useState(''); 
    const [dueDate, setDueDate] = useState(''); 
    const [priority, setPriority] = useState(''); 

    const handleCreateTask = async () => {
        // Fetch logged in user: 
        const {
            data: { user }, 
            error: userError, 
        } = await supabase.auth.getUser(); 

        if (userError || !user) {
            alert('Du er ikke innlogget!'); 
            return; 
        }

        const { error } = await supabase.from('tasks').insert([
            {
                user_id: user.id, 
                title, 
                due_date: dueDate, 
                priority, 
                status: 'open', 
            },
        ]);

        if (error) {
            alert('Kunne ikke opprette task: ' + error.message); 
            return; 
        }

        alert('Oppgave lagret!'); 
        navigation.navigate('TaskList'); 
    }; 

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20}}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Opprett oppgave</Text>

            <TextInput
                placeholder="Tittel"
                value={title}
                onChangeText={setTitle}
                style={{
                    borderWidth: 1, 
                    borderColor: '#ccc', 
                    padding: 10, 
                    marginBottom: 10, 
                    borderRadius: 5, 
                }}
            />

            <TextInput
                placeholder="Frist (YYYY-MM-DD)"
                value={dueDate}
                onChangeText={setDueDate}
                style={{
                    borderWidth: 1, 
                    borderColor: '#ccc', 
                    padding: 10, 
                    marginBottom: 10, 
                    borderRadius: 5, 
                }}
            />

            <TextInput
                placeholder="Prioritet (Low / Medium / High)"
                value={priority}
                onChangeText={setPriority}
                style={{
                    borderWidth: 1, 
                    borderColor: '#ccc',
                    padding: 10, 
                    marginBottom: 10, 
                    borderRadius: 5, 
                }}
            />

            <Button title="Lagre oppgave" onPress={handleCreateTask} />
        </View>
    );
}