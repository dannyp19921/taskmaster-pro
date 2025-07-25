// /src/features/tasks/hooks/useTasks.ts - RIKTIG VERSJON
import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../../../services/supabase';
import { Task, CreateTaskDto, UpdateTaskDto } from '../types/task.types';

interface UseTasksReturn {
  // State
  tasks: Task[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;

  // Actions
  fetchTasks: (isRefreshing?: boolean) => Promise<void>;
  createTask: (task: CreateTaskDto) => Promise<Task | null>;
  updateTask: (id: string, updates: UpdateTaskDto) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  toggleTaskStatus: (id: string) => Promise<boolean>;
  refresh: () => void;

  // Computed
  activeTasks: Task[];
  completedTasks: Task[];
  taskCounts: {
    all: number;
    active: number;
    completed: number;
  };
}

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 📥 Fetch tasks from database
  const fetchTasks = useCallback(async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Bruker ikke logget inn');
      }

      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setTasks(data || []);
    } catch (err: any) {
      const errorMessage = err.message || 'Kunne ikke hente oppgaver';
      setError(errorMessage);
      
      if (!isRefreshing) {
        Alert.alert('Feil', errorMessage);
      }
      console.error('Fetch tasks error:', err);
    } finally {
      if (isRefreshing) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  // ➕ Create new task
  const createTask = useCallback(async (taskData: CreateTaskDto): Promise<Task | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Bruker ikke logget inn');
      }

      const newTask = {
        ...taskData,
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

      // Oppdater lokal state
      setTasks(prevTasks => [...prevTasks, data]);
      
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Kunne ikke opprette oppgave';
      Alert.alert('Feil', errorMessage);
      console.error('Create task error:', err);
      return null;
    }
  }, []);

  // ✏️ Update existing task
  const updateTask = useCallback(async (id: string, updates: UpdateTaskDto): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      // Oppdater lokal state
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id ? { ...task, ...updates } : task
        )
      );

      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Kunne ikke oppdatere oppgave';
      Alert.alert('Feil', errorMessage);
      console.error('Update task error:', err);
      return false;
    }
  }, []);

  // 🗑️ Delete task
  const deleteTask = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      // Oppdater lokal state
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));

      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Kunne ikke slette oppgave';
      Alert.alert('Feil', errorMessage);
      console.error('Delete task error:', err);
      return false;
    }
  }, []);

  // ✅ Toggle task completion status
  const toggleTaskStatus = useCallback(async (id: string): Promise<boolean> => {
    const task = tasks.find(t => t.id === id);
    if (!task) return false;

    const newStatus = task.status === 'completed' ? 'open' : 'completed';
    return await updateTask(id, { status: newStatus });
  }, [tasks, updateTask]);

  // 🔄 Refresh tasks
  const refresh = useCallback(() => {
    fetchTasks(true);
  }, [fetchTasks]);

  // 📊 Computed values
  const activeTasks = tasks.filter(task => task.status === 'open');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  
  const taskCounts = {
    all: tasks.length,
    active: activeTasks.length,
    completed: completedTasks.length,
  };

  // 🚀 Initial fetch on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    // State
    tasks,
    loading,
    refreshing,
    error,

    // Actions
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    refresh,

    // Computed
    activeTasks,
    completedTasks,
    taskCounts,
  };
};