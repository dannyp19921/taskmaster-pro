// /src/screens/CreateTaskScreen.tsx

import React, { useState } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'; 
import { supabase } from '../services/supabase'; 

export default function CreateTaskScreen({ navigation }: any) {
    const [title, setTitle] = useState(''); 
    const [dueDate, setDueDate] = useState(''); 
    const [priority, setPriority] = useState('Medium'); // Default til Medium
    const [showPriorityPicker, setShowPriorityPicker] = useState(false);

    // Prioritet-alternativer
    const priorityOptions = ['High', 'Medium', 'Low'];

    // Enkel dato-validering
    const isValidDate = (dateString: string) => {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date.getTime()) && dateString.match(/^\d{4}-\d{2}-\d{2}$/);
    };

    const handleCreateTask = async () => {
        console.log('🚀 LAGRE OPPGAVE TRYKKET');
        console.log('📝 Tittel:', title);
        console.log('📅 Dato:', dueDate);
        console.log('⚡ Prioritet:', priority);

        // Validering
        if (!title.trim()) {
            console.log('❌ Tittel mangler');
            alert('Tittel kan ikke være tom'); // Bruk alert i stedet for Alert.alert
            return;
        }

        if (!dueDate.trim()) {
            console.log('❌ Dato mangler');
            alert('Frist må fylles ut');
            return;
        }

        if (!isValidDate(dueDate)) {
            console.log('❌ Ugyldig datoformat:', dueDate);
            alert('Frist må være i format YYYY-MM-DD (f.eks. 2025-12-31)');
            return;
        }

        // Sjekk at dato ikke er i fortiden
        const selectedDate = new Date(dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset tid for sammenligning

        if (selectedDate < today) {
            console.log('❌ Dato i fortiden:', dueDate);
            alert('Frist kan ikke være i fortiden');
            return;
        }

        try {
            console.log('📡 Henter bruker...');

            // Hent innlogget bruker
            const { data: { user }, error: userError } = await supabase.auth.getUser(); 

            if (userError || !user) {
                console.log('❌ Ikke innlogget:', userError?.message);
                alert('Du er ikke innlogget!'); 
                return; 
            }

            console.log('✅ Bruker funnet:', user.id);
            console.log('📤 Lagrer til database...');

            const { error } = await supabase.from('tasks').insert([
                {
                    user_id: user.id, 
                    title: title.trim(), 
                    due_date: dueDate, 
                    priority: priority, 
                    status: 'open', 
                },
            ]);

            if (error) {
                console.log('❌ Database-feil:', error.message);
                alert('Kunne ikke opprette oppgave: ' + error.message); 
                return; 
            }

            console.log('✅ Oppgave lagret!');
            alert('Oppgave lagret!');
            
            // Gå tilbake til TaskList
            navigation.navigate('TaskList');
            
        } catch (error) {
            console.log('💥 Uventet feil:', error);
            alert('En uventet feil oppstod: ' + error);
        }
    }; 

    // Prioritet dropdown - enklere og sikrere implementasjon
    const renderPriorityPicker = () => (
        <View style={styles.dropdownContainer}>
            <TouchableOpacity 
                style={styles.dropdownButton}
                onPress={() => setShowPriorityPicker(!showPriorityPicker)}
            >
                <Text style={styles.dropdownButtonText}>
                    {priority === 'High' ? '🔴 Høy' : 
                     priority === 'Medium' ? '🟡 Medium' : 
                     '🟢 Lav'}
                </Text>
                <Text style={styles.dropdownArrow}>
                    {showPriorityPicker ? '▲' : '▼'}
                </Text>
            </TouchableOpacity>

            {showPriorityPicker && (
                <View style={styles.dropdownOptions}>
                    <TouchableOpacity
                        style={[
                            styles.dropdownOption,
                            priority === 'High' && styles.dropdownOptionActive
                        ]}
                        onPress={() => {
                            setPriority('High');
                            setShowPriorityPicker(false);
                        }}
                    >
                        <Text style={[
                            styles.dropdownOptionText,
                            priority === 'High' && styles.dropdownOptionTextActive
                        ]}>
                            🔴 Høy
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.dropdownOption,
                            priority === 'Medium' && styles.dropdownOptionActive
                        ]}
                        onPress={() => {
                            setPriority('Medium');
                            setShowPriorityPicker(false);
                        }}
                    >
                        <Text style={[
                            styles.dropdownOptionText,
                            priority === 'Medium' && styles.dropdownOptionTextActive
                        ]}>
                            🟡 Medium
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.dropdownOption,
                            { borderBottomWidth: 0 }, // Siste element har ingen border
                            priority === 'Low' && styles.dropdownOptionActive
                        ]}
                        onPress={() => {
                            setPriority('Low');
                            setShowPriorityPicker(false);
                        }}
                    >
                        <Text style={[
                            styles.dropdownOptionText,
                            priority === 'Low' && styles.dropdownOptionTextActive
                        ]}>
                            🟢 Lav
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Opprett oppgave</Text>

            {/* Tittel input */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Tittel *</Text>
                <TextInput
                    placeholder="Skriv inn tittel..."
                    value={title}
                    onChangeText={setTitle}
                    style={styles.textInput}
                />
            </View>

            {/* Dato input med bedre hjelp */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Frist *</Text>
                <TextInput
                    placeholder="YYYY-MM-DD (f.eks. 2025-12-31)"
                    value={dueDate}
                    onChangeText={setDueDate}
                    style={styles.textInput}
                />
                <Text style={styles.helpText}>
                    Format: År-Måned-Dag (f.eks. 2025-07-30)
                </Text>
            </View>

            {/* Prioritet dropdown */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Prioritet *</Text>
                {renderPriorityPicker()}
            </View>

            {/* Ekstra spacing før knapper når dropdown er åpen */}
            {showPriorityPicker && <View style={{ height: 20 }} />}

            {/* Action knapper */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.createButton} onPress={handleCreateTask}>
                    <Text style={styles.createButtonText}>Lagre oppgave</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.cancelButton} 
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.cancelButtonText}>Avbryt</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333',
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        fontSize: 16,
        elevation: 2,
    },
    helpText: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
        fontStyle: 'italic',
    },
    dropdownContainer: {
        // Ingen position relative - lar dropdown flyte naturlig
        marginBottom: 10, // Ekstra plass for dropdown
    },
    dropdownButton: {
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 2,
    },
    dropdownButtonText: {
        fontSize: 16,
        color: '#333',
    },
    dropdownArrow: {
        fontSize: 14,
        color: '#666',
    },
    dropdownOptions: {
        // Ikke position absolute - naturlig flyt
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderTopWidth: 0, // Koble til knappen
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        elevation: 5,
        marginTop: -1, // Koble til knappen
    },
    dropdownOption: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    dropdownOptionActive: {
        backgroundColor: '#007AFF',
    },
    dropdownOptionText: {
        fontSize: 16,
        color: '#333',
    },
    dropdownOptionTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    buttonContainer: {
        marginTop: 30,
    },
    createButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
        elevation: 3,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        elevation: 2,
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
});