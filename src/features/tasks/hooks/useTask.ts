// /src/features/tasks/hooks/useTask.ts
import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../../../core/api/supabase';
import { Task } from '../types/task.types';

interface UseTaskReturn {
  // State
  task: Task | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchTask: () => Promise<void>;
  refetch: () => void;
}

export const useTask = (taskId: string): UseTaskReturn => {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 📥 Fetch single task from database
  const fetchTask = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📡 Henter oppgave med ID:', taskId);

      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          throw new Error('Oppgaven ble ikke funnet');
        }
        throw new Error(fetchError.message);
      }

      console.log('✅ Oppgave hentet:', data);
      setTask(data);
      
    } catch (err: any) {
      const errorMessage = err.message || 'Kunne ikke hente oppgaven';
      setError(errorMessage);
      console.error('Fetch task error:', err);
      
      Alert.alert('Feil', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  // 🔄 Refetch task (for manual refresh)
  const refetch = useCallback(() => {
    fetchTask();
  }, [fetchTask]);

  // 🚀 Initial fetch on mount or taskId change
  useEffect(() => {
    if (taskId) {
      fetchTask();
    }
  }, [taskId, fetchTask]);

  return {
    task,
    loading,
    error,
    fetchTask,
    refetch,
  };
};