// /src/features/tasks/hooks/useCreateTask.ts
import { useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../../../services/supabase';
import { CreateTaskDto, Task } from '../types/task.types';

interface UseCreateTaskReturn {
  // State
  loading: boolean;
  error: string | null;

  // Actions
  createTask: (taskData: CreateTaskDto) => Promise<Task | null>;
  resetError: () => void;
}

export const useCreateTask = (): UseCreateTaskReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTask = async (taskData: CreateTaskDto): Promise<Task | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Bruker ikke logget inn');
      }

      // Validate required fields
      if (!taskData.title.trim()) {
        throw new Error('Tittel er påkrevd');
      }

      if (!taskData.due_date) {
        throw new Error('Forfallsdato er påkrevd');
      }

      const newTask = {
        ...taskData,
        title: taskData.title.trim(),
        user_id: user.id,
        status: 'open' as const,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert([newTask])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // Success! Show confirmation
      Alert.alert(
        'Suksess! 🎉', 
        `Oppgaven "${data.title}" ble opprettet`,
        [{ text: 'OK' }]
      );

      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Kunne ikke opprette oppgave';
      setError(errorMessage);
      
      Alert.alert('Feil', errorMessage);
      console.error('Create task error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetError = () => {
    setError(null);
  };

  return {
    loading,
    error,
    createTask,
    resetError,
  };
};