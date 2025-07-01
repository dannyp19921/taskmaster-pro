// /src/screens/RegisterScreen.tsx: 

import { View, Text, TextInput, Button } from 'react-native'; 
import { useState } from 'react'; 
import { supabase } from '../services/supabase'; 

export default function RegisterScreen({ navigation }: any) {
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState(''); 

    const handleRegister = async () => {
        const { data, error } = await supabase.auth.signUp({
            email, 
            password, 
        }); 

        if (error) {
            alert('Registrering feilet: ' + error.message);
            return; 
        }

        alert('Regisrering vellykket! Sjekk e-post for bekreftelse');
        navigation.navigate('Login'); 
    };

    /* const handleRegister = () => {
        console.log('Prøver å registrere:', email, password); 
        // Here we can later integrate Supabase or backend 
        navigation.navigate('TaskList'); 
    }; */ 

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Registrer deg</Text>

            <TextInput 
                placeholder="E-post" 
                value={email}
                onChangeText={setEmail}
                style={{
                    borderWidth: 1, 
                    borderColor: '#ccc', 
                    padding: 10, 
                    marginBottom: 10, 
                    borderRadius: 5, 
                }}
            />

            <TextInput 
                placeholder="Passord" 
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{
                    borderWidth: 1, 
                    borderColor: '#ccc', 
                    padding: 10, 
                    marginBottom: 10, 
                    borderRadius: 5, 
                }}
            />

            <Button title="Registrer" onPress={handleRegister} />

            <Button
                title="Allerede bruker? Logg inn"
                onPress={() => navigation.navigate('Login')}
            />
        </View>
    ); 
}