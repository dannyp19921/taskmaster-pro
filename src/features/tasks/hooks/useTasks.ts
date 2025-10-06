// /src/features/tasks/hooks/useTasks.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../core/api/supabase';
import { Task, CreateTaskDto, UpdateTaskDto } from '../types/task.types';

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  
  fetchTasks: (isRefreshing?: boolean) => Promise<void>;
  createTask: (task: CreateTaskDto) => Promise<{ success: true; task: Task } | { success: false; error: string }>;
  updateTask: (id: string, updates: UpdateTaskDto) => Promise<{ success: boolean; error?: string }>;
  deleteTask: (id: string) => Promise<{ success: boolean; error?: string }>;
  toggleTaskStatus: (id: string) => Promise<{ success: boolean; error?: string }>;
  refresh: () => void;
  
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

  const fetchTasks = useCallback(async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      setError(null);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (!user || userError) {
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Kunne ikke hente oppgaver';
      setError(errorMessage);
      console.error('Fetch tasks error:', err);
    } finally {
      if (isRefreshing) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  const createTask = useCallback(async (taskData: CreateTaskDto) => {
    try {
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false as const, error: 'Bruker ikke logget inn' };
      }

      if (!taskData.title.trim()) {
        return { success: false as const, error: 'Tittel er påkrevd' };
      }

      if (!taskData.due_date) {
        return { success: false as const, error: 'Forfallsdato er påkrevd' };
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
        return { success: false as const, error: error.message };
      }

      setTasks(prevTasks => [...prevTasks, data]);
      
      return { success: true as const, task: data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Kunne ikke opprette oppgave';
      setError(errorMessage);
      console.error('Create task error:', err);
      return { success: false as const, error: errorMessage };
    }
  }, []);

  const updateTask = useCallback(async (id: string, updates: UpdateTaskDto) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id ? { ...task, ...updates } : task
        )
      );

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Kunne ikke oppdatere oppgave';
      console.error('Update task error:', err);
      return { success: false, error: errorMessage };
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Kunne ikke slette oppgave';
      console.error('Delete task error:', err);
      return { success: false, error: errorMessage };
    }
  }, []);

  const toggleTaskStatus = useCallback(async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) {
      return { success: false, error: 'Oppgave ikke funnet' };
    }

    const newStatus = task.status === 'completed' ? 'open' : 'completed';
    return await updateTask(id, { status: newStatus });
  }, [tasks, updateTask]);

  const refresh = useCallback(() => {
    fetchTasks(true);
  }, [fetchTasks]);

  const activeTasks = tasks.filter(task => task.status === 'open');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  
  const taskCounts = {
    all: tasks.length,
    active: activeTasks.length,
    completed: completedTasks.length,
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    refreshing,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    refresh,
    activeTasks,
    completedTasks,
    taskCounts,
  };
};