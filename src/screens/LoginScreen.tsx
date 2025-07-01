// /src/screens/LoginScreen.tsx: 

import { View, Text, TextInput, Button } from 'react-native'; 
import { useState } from 'react'; 

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState(''); 

    const handleLogin = () => {
        console.log('Prøver å logge inn med', email, password); 
        // Here we shall integrate Supabase or backend later on
        navigation.navigate('TaskList'); 
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <Text style={{ fontSize: 24, marginBottom: 20}}>Logg inn</Text>

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

            <Button title="Logg inn" onPress={handleLogin} />

            <Button
                title="Ny bruker? Registrer deg"
                onPress={() => navigation.navigate('Register')}
            />
        </View>
    );
}