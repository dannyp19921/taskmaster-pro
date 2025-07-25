// /src/features/tasks/hooks/useUpdateTask.ts
import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../../../services/supabase';
import { UpdateTaskDto, Task } from '../types/task.types';

interface UseUpdateTaskReturn {
  // State
  updateLoading: boolean;
  deleteLoading: boolean;
  error: string | null;

  // Actions
  updateTask: (taskId: string, updates: UpdateTaskDto) => Promise<Task | null>;
  deleteTask: (taskId: string) => Promise<boolean>;
  toggleTaskStatus: (task: Task) => Promise<Task | null>;
  resetError: () => void;
}

export const useUpdateTask = (): UseUpdateTaskReturn => {
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✏️ Update existing task
  const updateTask = useCallback(async (taskId: string, updates: UpdateTaskDto): Promise<Task | null> => {
    try {
      setUpdateLoading(true);
      setError(null);
      
      console.log('💾 Lagrer endringer for oppgave:', taskId);

      // Validate required fields
      if (updates.title !== undefined && !updates.title.trim()) {
        throw new Error('Tittel kan ikke være tom');
      }

      if (updates.due_date !== undefined && !updates.due_date) {
        throw new Error('Frist må velges');
      }

      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      // Clean up title if provided
      if (updateData.title) {
        updateData.title = updateData.title.trim();
      }

      const { data, error: updateError } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId)
        .select()
        .single();

      if (updateError) {
        throw new Error(updateError.message);
      }

      console.log('✅ Oppgave lagret!');
      Alert.alert('Suksess! 🎉', 'Endringer lagret!');
      
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Kunne ikke lagre endringene';
      setError(errorMessage);
      
      Alert.alert('Feil', errorMessage);
      console.error('Update task error:', err);
      return null;
    } finally {
      setUpdateLoading(false);
    }
  }, []);

  // 🗑️ Delete task with confirmation
  const deleteTask = useCallback(async (taskId: string): Promise<boolean> => {
    try {
      setDeleteLoading(true);
      setError(null);

      // Show confirmation dialog
      return new Promise((resolve) => {
        Alert.alert(
          'Slett oppgave',
          'Er du sikker på at du vil slette denne oppgaven?',
          [
            {
              text: 'Avbryt',
              style: 'cancel',
              onPress: () => {
                setDeleteLoading(false);
                resolve(false);
              },
            },
            {
              text: 'Slett',
              style: 'destructive',
              onPress: async () => {
                try {
                  console.log('🗑️ Sletter oppgave:', taskId);

                  const { error: deleteError } = await supabase
                    .from('tasks')
                    .delete()
                    .eq('id', taskId);

                  if (deleteError) {
                    throw new Error(deleteError.message);
                  }

                  console.log('✅ Oppgave slettet!');
                  Alert.alert('Suksess! 🎉', 'Oppgave slettet!');
                  resolve(true);
                } catch (err: any) {
                  const errorMessage = err.message || 'Kunne ikke slette oppgaven';
                  setError(errorMessage);
                  
                  Alert.alert('Feil', errorMessage);
                  console.error('Delete task error:', err);
                  resolve(false);
                } finally {
                  setDeleteLoading(false);
                }
              },
            },
          ]
        );
      });
    } catch (err: any) {
      setDeleteLoading(false);
      return false;
    }
  }, []);

  // ✅ Toggle task completion status
  const toggleTaskStatus = useCallback(async (task: Task): Promise<Task | null> => {
    const newStatus = task.status === 'completed' ? 'open' : 'completed';
    const statusText = newStatus === 'completed' ? 'fullført' : 'åpen';
    
    console.log(`🔄 Endrer status til: ${statusText}`);
    
    return await updateTask(task.id, { status: newStatus });
  }, [updateTask]);

  // 🧹 Reset error state
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    updateLoading,
    deleteLoading,
    error,

    // Actions
    updateTask,
    deleteTask,
    toggleTaskStatus,
    resetError,
  };
};