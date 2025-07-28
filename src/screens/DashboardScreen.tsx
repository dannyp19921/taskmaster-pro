// /src/screens/DashboardScreen.tsx - 100% Modern Architecture! 📊✨

import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';

// 🎯 Business logic hooks
import { useDashboardData } from '../features/tasks/hooks/useDashboardData';

// 🎨 UI components - Perfect atomic design!
import { Button, Text } from '../shared/ui';
import { Header } from '../shared/ui/organisms/Header';
import { 
  StatCard, 
  ProgressBar, 
  CategoryList, 
  PriorityOverview 
} from '../shared/ui/organisms/DashboardComponents';

// 🌐 Context
import { useTheme } from '../context/ThemeContext';

interface DashboardScreenProps {
  navigation: any;
}

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  const { theme } = useTheme();
  
  // 🎯 All business logic in custom hook!
  const { 
    stats, 
    loading, 
    refreshing, 
    error, 
    onRefresh, 
    retry 
  } = useDashboardData();

  // 🔄 Loading state
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text variant="body1" color="secondary" style={styles.loadingText}>
          Laster dashboard...
        </Text>
      </View>
    );
  }

  // ❌ Error state
  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.background }]}>
        <Text variant="h2" color="primary" style={styles.errorTitle}>
          {error}
        </Text>
        <Button
          variant="primary"
          size="large"
          onPress={retry}
          style={styles.retryButton}
        >
          🔄 Prøv igjen
        </Button>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* 📱 Header - Using organism! */}
      <Header 
        title="Dashboard"
        subtitle="Oversikt over dine oppgaver"
        showThemeToggle={true}
      />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
      >
        {/* 📊 Main Statistics */}
        <View style={styles.section}>
          <Text variant="h3" color="primary" style={styles.sectionTitle}>
            📊 Oversikt
          </Text>
          
          <View style={styles.statsGrid}>
            <StatCard
              title="Totalt oppgaver"
              value={stats.total}
              color="#007AFF"
              icon="📝"
              testID="total-tasks-card"
            />
            
            <StatCard
              title="Fullført"
              value={stats.completed}
              subtitle={`${stats.completionRate}% av alle`}
              color="#4CAF50"
              icon="✅"
              testID="completed-tasks-card"
            />
          </View>

          <View style={styles.statsGrid}>
            <StatCard
              title="Aktive"
              value={stats.active}
              color="#FF9800"
              icon="⚡"
              testID="active-tasks-card"
            />
            
            <StatCard
              title="Utløpt"
              value={stats.overdueTasks}
              color="#F44336"
              icon="⚠️"
              testID="overdue-tasks-card"
            />
          </View>

          {/* Progress indicator */}
          <ProgressBar 
            progress={stats.completionRate} 
            color="#4CAF50"
            label="Fullføringsgrad"
            testID="completion-progress"
          />
        </View>

        {/* ⏰ Upcoming Deadlines */}
        <View style={styles.section}>
          <Text variant="h3" color="primary" style={styles.sectionTitle}>
            ⏰ Kommende frister
          </Text>
          
          <View style={styles.statsGrid}>
            <StatCard
              title="I dag"
              value={stats.todayTasks}
              color="#FF6B35"
              icon="🔥"
              testID="today-tasks-card"
            />
            
            <StatCard
              title="I morgen"
              value={stats.tomorrowTasks}
              color="#FFA500"
              icon="📅"
              testID="tomorrow-tasks-card"
            />
          </View>
        </View>

        {/* ⚡ Priority Overview */}
        <View style={styles.section}>
          <Text variant="h3" color="primary" style={styles.sectionTitle}>
            ⚡ Aktive prioriteter
          </Text>
          
          <PriorityOverview
            highPriority={stats.highPriority}
            mediumPriority={stats.mediumPriority}
            lowPriority={stats.lowPriority}
            testID="priority-overview"
          />
        </View>

        {/* 🏷️ Category Distribution */}
        {stats.categoryStats.length > 0 && (
          <View style={styles.section}>
            <Text variant="h3" color="primary" style={styles.sectionTitle}>
              🏷️ Kategorier
            </Text>
            
            <CategoryList 
              categories={stats.categoryStats}
              testID="category-list"
            />
          </View>
        )}

        {/* 📈 This Week */}
        <View style={styles.section}>
          <Text variant="h3" color="primary" style={styles.sectionTitle}>
            📈 Denne uken
          </Text>
          
          <View style={styles.statsGrid}>
            <StatCard
              title="Nye oppgaver"
              value={stats.tasksThisWeek}
              color="#2196F3"
              icon="➕"
              testID="week-new-tasks-card"
            />
            
            <StatCard
              title="Fullført"
              value={stats.completedThisWeek}
              color="#4CAF50"
              icon="🎉"
              testID="week-completed-tasks-card"
            />
          </View>
        </View>

        {/* 🚀 Quick Actions */}
        <View style={styles.actionSection}>
          <Text variant="h3" color="primary" style={styles.sectionTitle}>
            🚀 Handlinger
          </Text>
          
          <Button
            variant="primary"
            size="large"
            onPress={() => navigation.navigate('CreateTask')}
            style={styles.actionButton}
            testID="create-task-button"
          >
            ➕ Opprett ny oppgave
          </Button>
          
          <Button
            variant="secondary"
            size="large"
            onPress={() => navigation.navigate('TaskList')}
            style={styles.actionButton}
            testID="view-all-tasks-button"
          >
            📋 Se alle oppgaver
          </Button>
        </View>

        {/* Bottom spacing for scroll */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionSection: {
    marginBottom: 24,
  },
  actionButton: {
    marginBottom: 12,
  },
  bottomSpacing: {
    height: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 32,
  },
});