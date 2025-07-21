// /src/screens/TaskDetailScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { supabase } from '../services/supabase';

interface Task {
  id: string;
  title: string;
  due_date: string;
  priority: string;
  user_id: string;
}

export default function TaskDetailScreen({ navigation, route }: any) {
  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('');
  const [loading, setLoading] = useState(true);

  const { taskId } = route.params;

  // Hent oppgave når skjermen lastes
  useEffect(() => {
    fetchTask();
  }, []);

  const fetchTask = async () => {
    console.log('📡 Henter oppgave med ID:', taskId);

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (error) {
        console.log('❌ Feil ved henting av oppgave:', error.message);
        alert('Kunne ikke hente oppgaven');
        navigation.goBack();
        return;
      }

      console.log('✅ Oppgave hentet:', data);
      setTask(data);
      setTitle(data.title);
      setDueDate(data.due_date);
      setPriority(data.priority);
    } catch (error) {
      console.log('💥 Uventet feil:', error);
      alert('En uventet feil oppstod');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTask = async () => {
    if (!title.trim()) {
      alert('Tittel kan ikke være tom');
      return;
    }

    console.log('💾 Lagrer endringer for oppgave:', taskId);

    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          title: title.trim(),
          due_date: dueDate,
          priority: priority,
        })
        .eq('id', taskId);

      if (error) {
        console.log('❌ Kunne ikke lagre:', error.message);
        alert('Kunne ikke lagre endringene: ' + error.message);
        return;
      }

      console.log('✅ Oppgave lagret!');
      alert('Endringer lagret!');
      navigation.goBack();
    } catch (error) {
      console.log('💥 Uventet feil ved lagring:', error);
      alert('En uventet feil oppstod');
    }
  };

  const handleDeleteTask = async () => {
    const shouldDelete = confirm('Er du sikker på at du vil slette denne oppgaven?');
    
    if (!shouldDelete) {
      return;
    }

    console.log('🗑️ Sletter oppgave:', taskId);

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) {
        console.log('❌ Kunne ikke slette:', error.message);
        alert('Kunne ikke slette oppgaven: ' + error.message);
        return;
      }

      console.log('✅ Oppgave slettet!');
      alert('Oppgave slettet!');
      navigation.goBack();
    } catch (error) {
      console.log('💥 Uventet feil ved sletting:', error);
      alert('En uventet feil oppstod');
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Laster oppgave...</Text>
      </View>
    );
  }

  if (!task) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Oppgaven ble ikke funnet</Text>
        <Button title="Gå tilbake" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Rediger oppgave</Text>

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
          marginBottom: 20,
          borderRadius: 5,
        }}
      />

      <Button title="Lagre endringer" onPress={handleSaveTask} />
      
      <View style={{ marginTop: 10 }}>
        <Button title="Slett oppgave" onPress={handleDeleteTask} color="red" />
      </View>
      
      <View style={{ marginTop: 10 }}>
        <Button title="Avbryt" onPress={() => navigation.goBack()} color="gray" />
      </View>
    </View>
  );
}