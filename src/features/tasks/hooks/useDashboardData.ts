// /src/features/tasks/hooks/useDashboardData.ts - Dashboard business logic! 📊

import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../../services/supabase';
import { Task } from '../types/task.types';
import { CATEGORY_OPTIONS } from '../../../shared/utils/categories';

interface DashboardStats {
  total: number;
  completed: number;
  active: number;
  completionRate: number;
  todayTasks: number;
  tomorrowTasks: number;
  overdueTasks: number;
  categoryStats: Array<{ value: string; label: string; color: string; count: number }>;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
  tasksThisWeek: number;
  completedThisWeek: number;
}

export const useDashboardData = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 📊 Calculate comprehensive dashboard statistics
  const getStats = useCallback((): DashboardStats => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const active = tasks.filter(t => t.status === 'open').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Date calculations
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayTasks = tasks.filter(t => {
      const taskDate = new Date(t.due_date);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === today.getTime() && t.status === 'open';
    }).length;

    const tomorrowTasks = tasks.filter(t => {
      const taskDate = new Date(t.due_date);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === tomorrow.getTime() && t.status === 'open';
    }).length;

    // Overdue tasks
    const overdueTasks = tasks.filter(t => {
      const taskDate = new Date(t.due_date);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() < today.getTime() && t.status === 'open';
    }).length;

    // Category distribution
    const categoryStats = CATEGORY_OPTIONS.map(cat => {
      const count = tasks.filter(t => (t.category || 'Personlig') === cat.value).length;
      return { ...cat, count };
    }).filter(cat => cat.count > 0);

    // Priority distribution (active only)
    const highPriority = tasks.filter(t => t.priority === 'High' && t.status === 'open').length;
    const mediumPriority = tasks.filter(t => t.priority === 'Medium' && t.status === 'open').length;
    const lowPriority = tasks.filter(t => t.priority === 'Low' && t.status === 'open').length;

    // This week statistics
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Sunday
    
    const tasksThisWeek = tasks.filter(t => {
      if (!t.created_at) return false; // Skip if no created_at
      const taskDate = new Date(t.created_at);
      return taskDate >= weekStart;
    }).length;

    const completedThisWeek = tasks.filter(t => {
      if (!t.created_at) return false; // Skip if no created_at
      const taskDate = new Date(t.created_at);
      return taskDate >= weekStart && t.status === 'completed';
    }).length;

    return {
      total,
      completed,
      active,
      completionRate,
      todayTasks,
      tomorrowTasks,
      overdueTasks,
      categoryStats,
      highPriority,
      mediumPriority,
      lowPriority,
      tasksThisWeek,
      completedThisWeek,
    };
  }, [tasks]);

  // 📡 Fetch tasks from database
  const fetchTasks = async (isRefreshing = false) => {
    try {
      setError(null);
      
      if (isRefreshing) {
        console.log('🔄 Refreshing dashboard...');
      } else {
        console.log('📊 Fetching dashboard data...');
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.log('🚫 Not logged in:', userError?.message);
        setError('Du må være innlogget for å se dashboard');
        return;
      }

      const { data, error } = await supabase
        .from('tasks')
        .select('id, title, due_date, priority, category, status, user_id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.log('❌ Error fetching tasks:', error.message);
        setError('Kunne ikke hente oppgaver: ' + error.message);
        return;
      }

      console.log('✅ Dashboard data fetched:', data?.length || 0, 'tasks');
      setTasks(data || []);
    } catch (error) {
      console.log('💥 Unexpected error:', error);
      setError('En uventet feil oppstod');
    } finally {
      if (isRefreshing) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  // 🔄 Pull-to-refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTasks(true);
  }, []);

  // 🎯 Load data on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // 🔄 Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('🔄 Dashboard focused - refreshing data');
      fetchTasks();
    }, [])
  );

  // 🔄 Retry function for error states
  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchTasks();
  }, []);

  return {
    tasks,
    stats: getStats(),
    loading,
    refreshing,
    error,
    onRefresh,
    retry,
  };
};