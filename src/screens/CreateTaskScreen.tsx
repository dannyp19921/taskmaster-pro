// /src/screens/CreateTaskScreen.tsx

import React, { useState } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from 'react-native'; 
import { supabase } from '../services/supabase'; 

export default function CreateTaskScreen({ navigation }: any) {
    const [title, setTitle] = useState(''); 
    const [dueDate, setDueDate] = useState(''); 
    const [priority, setPriority] = useState('Medium');
    const [showPriorityPicker, setShowPriorityPicker] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [saving, setSaving] = useState(false); // Loading state for save button

    // Prioritet-alternativer
    const priorityOptions = ['High', 'Medium', 'Low'];

    // Formatter dato til YYYY-MM-DD (lokal tid, ikke UTC)
    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Formatter dato til visning (norsk format)
    const formatDateDisplay = (dateString: string) => {
        if (!dateString) return '';
        
        // Parse YYYY-MM-DD string til lokale dato-komponenter
        const [year, month, day] = dateString.split('-');
        return `${day}.${month}.${year}`;
    };

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
            alert('Tittel kan ikke være tom');
            return;
        }

        if (!dueDate) {
            console.log('❌ Dato mangler');
            alert('Frist må velges');
            return;
        }

        try {
            console.log('📝 Oppretter oppgave...');
            setSaving(true); // Start loading

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
        } finally {
            setSaving(false); // Stop loading
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

    // Enkel kalender-komponent
    const renderCalendar = () => {
        const today = new Date();
        const currentMonth = selectedDate.getMonth();
        const currentYear = selectedDate.getFullYear();
        
        // Første dag i måneden
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        
        // Hvor mange dager i måneden
        const daysInMonth = lastDay.getDate();
        
        // Hvilken ukedag starter måneden (0 = søndag, 1 = mandag, etc.)
        const startDayOfWeek = firstDay.getDay();
        
        const monthNames = [
            'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
            'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'
        ];
        
        const weekDays = ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'];
        
        // Generer alle dager
        const days = [];
        
        // Tomme celler for dager før månedens start
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push(<View key={`empty-${i}`} style={styles.emptyDay} />);
        }
        
        // Dager i måneden
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const isPast = date < today && !isToday;
            
            days.push(
                <TouchableOpacity
                    key={day}
                    style={[
                        styles.dayButton,
                        isToday && styles.todayButton,
                        isSelected && styles.selectedDayButton,
                        isPast && styles.pastDayButton
                    ]}
                    onPress={() => {
                        if (!isPast) {
                            setSelectedDate(date);
                            setDueDate(formatDate(date));
                            setShowCalendar(false);
                        }
                    }}
                    disabled={isPast}
                >
                    <Text style={[
                        styles.dayText,
                        isToday && styles.todayText,
                        isSelected && styles.selectedDayText,
                        isPast && styles.pastDayText
                    ]}>
                        {day}
                    </Text>
                </TouchableOpacity>
            );
        }
        
        return (
            <Modal visible={showCalendar} transparent animationType="fade">
                <View style={styles.calendarOverlay}>
                    <View style={styles.calendarContainer}>
                        {/* Header */}
                        <View style={styles.calendarHeader}>
                            <TouchableOpacity
                                onPress={() => {
                                    const prevMonth = new Date(selectedDate);
                                    prevMonth.setMonth(prevMonth.getMonth() - 1);
                                    setSelectedDate(prevMonth);
                                }}
                                style={styles.navButton}
                            >
                                <Text style={styles.navButtonText}>‹</Text>
                            </TouchableOpacity>
                            
                            <Text style={styles.monthYearText}>
                                {monthNames[currentMonth]} {currentYear}
                            </Text>
                            
                            <TouchableOpacity
                                onPress={() => {
                                    const nextMonth = new Date(selectedDate);
                                    nextMonth.setMonth(nextMonth.getMonth() + 1);
                                    setSelectedDate(nextMonth);
                                }}
                                style={styles.navButton}
                            >
                                <Text style={styles.navButtonText}>›</Text>
                            </TouchableOpacity>
                        </View>
                        
                        {/* Ukedager */}
                        <View style={styles.weekDaysRow}>
                            {weekDays.map(day => (
                                <Text key={day} style={styles.weekDayText}>{day}</Text>
                            ))}
                        </View>
                        
                        {/* Kalendergrid */}
                        <View style={styles.calendarGrid}>
                            {days}
                        </View>
                        
                        {/* Knapper */}
                        <View style={styles.calendarButtons}>
                            <TouchableOpacity 
                                style={styles.cancelCalendarButton}
                                onPress={() => setShowCalendar(false)}
                            >
                                <Text style={styles.cancelCalendarText}>Avbryt</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };

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

            {/* Dato picker - nå med kalender */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Frist *</Text>
                <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowCalendar(true)}
                >
                    <Text style={styles.datePickerText}>
                        {dueDate ? formatDateDisplay(dueDate) : 'Velg dato'}
                    </Text>
                    <Text style={styles.calendarIcon}>📅</Text>
                </TouchableOpacity>
                <Text style={styles.helpText}>
                    Trykk for å åpne kalender
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
                <TouchableOpacity 
                    style={[styles.createButton, saving && styles.buttonLoading]} 
                    onPress={handleCreateTask}
                    disabled={saving}
                >
                    {saving ? (
                        <View style={styles.buttonContent}>
                            <ActivityIndicator size="small" color="#fff" style={styles.spinner} />
                            <Text style={styles.createButtonText}>Lagrer...</Text>
                        </View>
                    ) : (
                        <Text style={styles.createButtonText}>Lagre oppgave</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.cancelButton, saving && styles.buttonDisabled]} 
                    onPress={() => navigation.goBack()}
                    disabled={saving}
                >
                    <Text style={[styles.cancelButtonText, saving && styles.disabledText]}>
                        Avbryt
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Kalender modal */}
            {renderCalendar()}
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
    // Kalender-styling
    datePickerButton: {
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
    datePickerText: {
        fontSize: 16,
        color: '#333',
    },
    calendarIcon: {
        fontSize: 18,
    },
    calendarOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    calendarContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        margin: 20,
        maxWidth: 350,
        elevation: 10,
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    navButton: {
        padding: 10,
    },
    navButtonText: {
        fontSize: 24,
        color: '#007AFF',
        fontWeight: 'bold',
    },
    monthYearText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    weekDaysRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    weekDayText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        paddingVertical: 5,
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    emptyDay: {
        width: '14.28%',
        height: 40,
    },
    dayButton: {
        width: '14.28%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
    },
    todayButton: {
        backgroundColor: '#007AFF',
    },
    selectedDayButton: {
        backgroundColor: '#4CAF50',
    },
    pastDayButton: {
        opacity: 0.3,
    },
    dayText: {
        fontSize: 16,
        color: '#333',
    },
    todayText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    selectedDayText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    pastDayText: {
        color: '#ccc',
    },
    calendarButtons: {
        marginTop: 20,
        alignItems: 'center',
    },
    cancelCalendarButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 6,
        backgroundColor: '#f0f0f0',
    },
    cancelCalendarText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
    // Loading states styling
    buttonLoading: {
        opacity: 0.7,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    spinner: {
        marginRight: 8,
    },
    disabledText: {
        color: '#999',
    },
});