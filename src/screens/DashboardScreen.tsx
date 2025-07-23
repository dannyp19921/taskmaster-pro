// /src/screens/DashboardScreen.tsx - Statistikk og oversikt

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../services/supabase';

interface Task {
  id: string;
  title: string;
  due_date: string;
  priority: string;
  category?: string;
  status: string;
  user_id: string;
  created_at: string;
}

interface DashboardScreenProps {
  navigation: any;
}

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Kategori-alternativer (samme som andre screens)
  const categoryOptions = [
    { value: 'Arbeid', label: '💼 Arbeid', color: '#007AFF' },
    { value: 'Personlig', label: '👤 Personlig', color: '#4CAF50' },
    { value: 'Helse', label: '🏃‍♂️ Helse', color: '#FF9800' },
    { value: 'Økonomi', label: '💰 Økonomi', color: '#9C27B0' },
    { value: 'Utdanning', label: '📚 Utdanning', color: '#2196F3' },
    { value: 'Familie', label: '👨‍👩‍👧‍👦 Familie', color: '#E91E63' },
    { value: 'Hobby', label: '🎨 Hobby', color: '#FF5722' },
    { value: 'Annet', label: '📝 Annet', color: '#607D8B' }
  ];

  // Finn kategori-info
  const getCategoryInfo = (categoryValue?: string) => {
    if (!categoryValue) return categoryOptions[1]; // Default til Personlig
    return categoryOptions.find(cat => cat.value === categoryValue) || categoryOptions[1];
  };

  // Hent oppgaver fra database
  const fetchTasks = async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        console.log('🔄 Refresher dashboard...');
      } else {
        console.log('📊 Henter dashboard-data...');
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.log('🚫 Ikke innlogget:', userError?.message);
        return;
      }

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.log('❌ Feil ved henting:', error.message);
        return;
      }

      console.log('✅ Dashboard-data hentet:', data?.length || 0);
      setTasks(data || []);
    } catch (error) {
      console.log('💥 Uventet feil:', error);
    } finally {
      if (isRefreshing) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Pull-to-refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    fetchTasks(true);
  };

  // Last data når skjermen lastes
  useEffect(() => {
    fetchTasks();
  }, []);

  // Oppdater når skjermen kommer i fokus
  useFocusEffect(
    useCallback(() => {
      console.log('🔄 Dashboard kom i fokus - oppdaterer data');
      fetchTasks();
    }, [])
  );

  // Beregn statistikker
  const getStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const active = tasks.filter(t => t.status === 'open').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Dagens og morgendagens oppgaver
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayTasks = tasks.filter(t => {
      const taskDate = new Date(t.due_date);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === today.getTime() && t.status === 'open';
    });

    const tomorrowTasks = tasks.filter(t => {
      const taskDate = new Date(t.due_date);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === tomorrow.getTime() && t.status === 'open';
    });

    // Utløpte oppgaver
    const overdueTasks = tasks.filter(t => {
      const taskDate = new Date(t.due_date);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() < today.getTime() && t.status === 'open';
    });

    // Kategori-fordeling
    const categoryStats = categoryOptions.map(cat => {
      const count = tasks.filter(t => (t.category || 'Personlig') === cat.value).length;
      return { ...cat, count };
    }).filter(cat => cat.count > 0);

    // Prioritet-fordeling
    const highPriority = tasks.filter(t => t.priority === 'High' && t.status === 'open').length;
    const mediumPriority = tasks.filter(t => t.priority === 'Medium' && t.status === 'open').length;
    const lowPriority = tasks.filter(t => t.priority === 'Low' && t.status === 'open').length;

    // Denne uken statistikk
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Søndag
    
    const tasksThisWeek = tasks.filter(t => {
      const taskDate = new Date(t.created_at);
      return taskDate >= weekStart;
    });

    const completedThisWeek = tasks.filter(t => {
      const taskDate = new Date(t.created_at);
      return taskDate >= weekStart && t.status === 'completed';
    });

    return {
      total,
      completed,
      active,
      completionRate,
      todayTasks: todayTasks.length,
      tomorrowTasks: tomorrowTasks.length,
      overdueTasks: overdueTasks.length,
      categoryStats,
      highPriority,
      mediumPriority,
      lowPriority,
      tasksThisWeek: tasksThisWeek.length,
      completedThisWeek: completedThisWeek.length
    };
  };

  const stats = getStats();

  // Statistikk-kort komponent
  const StatCard = ({ title, value, subtitle, color, icon }: {
    title: string;
    value: string | number;
    subtitle?: string;
    color: string;
    icon: string;
  }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <Text style={styles.statIcon}>{icon}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  // Progress bar komponent
  const ProgressBar = ({ progress, color }: { progress: number; color: string }) => (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBarBackground}>
        <View 
          style={[
            styles.progressBarFill, 
            { width: `${progress}%`, backgroundColor: color }
          ]} 
        />
      </View>
      <Text style={styles.progressText}>{progress}%</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Laster dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#007AFF']}
          tintColor="#007AFF"
        />
      }
    >
      <Text style={styles.header}>📊 Dashboard</Text>

      {/* Hovedstatistikk */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Oversikt</Text>
        
        <View style={styles.statsGrid}>
          <StatCard
            title="Totalt oppgaver"
            value={stats.total}
            color="#007AFF"
            icon="📝"
          />
          
          <StatCard
            title="Fullført"
            value={stats.completed}
            subtitle={`${stats.completionRate}% av alle`}
            color="#4CAF50"
            icon="✅"
          />
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title="Aktive"
            value={stats.active}
            color="#FF9800"
            icon="⚡"
          />
          
          <StatCard
            title="Utløpt"
            value={stats.overdueTasks}
            color="#ff4444"
            icon="⚠️"
          />
        </View>

        {/* Progress bar */}
        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>Fullføringsgrad</Text>
          <ProgressBar progress={stats.completionRate} color="#4CAF50" />
        </View>
      </View>

      {/* Deadline-varsler */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kommende frister</Text>
        
        <View style={styles.statsGrid}>
          <StatCard
            title="I dag"
            value={stats.todayTasks}
            color="#ff6b35"
            icon="🔥"
          />
          
          <StatCard
            title="I morgen"
            value={stats.tomorrowTasks}
            color="#ffa500"
            icon="📅"
          />
        </View>
      </View>

      {/* Prioritet-oversikt */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aktive prioriteter</Text>
        
        <View style={styles.priorityContainer}>
          <View style={styles.priorityItem}>
            <Text style={styles.priorityIcon}>🔴</Text>
            <Text style={styles.priorityLabel}>Høy</Text>
            <Text style={styles.priorityValue}>{stats.highPriority}</Text>
          </View>
          
          <View style={styles.priorityItem}>
            <Text style={styles.priorityIcon}>🟡</Text>
            <Text style={styles.priorityLabel}>Medium</Text>
            <Text style={styles.priorityValue}>{stats.mediumPriority}</Text>
          </View>
          
          <View style={styles.priorityItem}>
            <Text style={styles.priorityIcon}>🟢</Text>
            <Text style={styles.priorityLabel}>Lav</Text>
            <Text style={styles.priorityValue}>{stats.lowPriority}</Text>
          </View>
        </View>
      </View>

      {/* Kategori-fordeling */}
      {stats.categoryStats.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kategorier</Text>
          
          {stats.categoryStats.map(cat => (
            <View key={cat.value} style={styles.categoryItem}>
              <View style={[styles.categoryDot, { backgroundColor: cat.color }]} />
              <Text style={styles.categoryLabel}>{cat.label}</Text>
              <Text style={styles.categoryValue}>{cat.count}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Denne uken */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Denne uken</Text>
        
        <View style={styles.statsGrid}>
          <StatCard
            title="Nye oppgaver"
            value={stats.tasksThisWeek}
            color="#2196F3"
            icon="➕"
          />
          
          <StatCard
            title="Fullført"
            value={stats.completedThisWeek}
            color="#4CAF50"
            icon="🎉"
          />
        </View>
      </View>

      {/* Handlinger */}
      <View style={styles.actionSection}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('CreateTask')}
        >
          <Text style={styles.actionButtonText}>➕ Opprett ny oppgave</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => navigation.navigate('TaskList')}
        >
          <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>📋 Se alle oppgaver</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom spacing */}
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  section: {
    margin: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    borderLeftWidth: 4,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  progressSection: {
    marginTop: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    elevation: 3,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    minWidth: 35,
  },
  priorityContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    elevation: 3,
  },
  priorityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  priorityIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  priorityLabel: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  priorityValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    minWidth: 30,
    textAlign: 'right',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    elevation: 2,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryLabel: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  categoryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    minWidth: 30,
    textAlign: 'right',
  },
  actionSection: {
    margin: 20,
    gap: 10,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#007AFF',
  },
});