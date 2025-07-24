// /src/components/TaskCard.tsx - Forenklet og modulær oppgave-komponent

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

interface Task {
  id: string;
  title: string;
  due_date: string;
  priority: string;
  category?: string;
  status: string;
  user_id: string;
}

interface TaskCardProps {
  task: Task;
  isSelected: boolean;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

// Kategori-definitioner (kan flyttes til egen fil senere)
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

export default function TaskCard({ task, isSelected, onPress, onEdit, onDelete }: TaskCardProps) {
  const { theme, isDarkMode } = useTheme();

  // 🔧 FORENKLET: En funksjon for alle deadline-beregninger
  const getDeadlineInfo = () => {
    const today = new Date();
    const deadline = new Date(task.due_date);
    
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (daysDiff < 0) {
      return { color: theme.overdue, badge: 'UTLØPT', message: `Utløpt for ${Math.abs(daysDiff)} dag${Math.abs(daysDiff) > 1 ? 'er' : ''} siden` };
    } else if (daysDiff === 0) {
      return { color: theme.today, badge: 'I DAG!', message: 'Utløper i dag!' };
    } else if (daysDiff === 1) {
      return { color: theme.warning, badge: 'I MORGEN', message: 'Utløper i morgen' };
    } else if (daysDiff <= 3) {
      return { color: theme.soon, badge: `${daysDiff} DAGER`, message: `${daysDiff} dager igjen` };
    } else if (daysDiff <= 7) {
      return { color: theme.success, badge: `${daysDiff} DAGER`, message: `${daysDiff} dager igjen` };
    } else {
      return { color: theme.textTertiary, badge: null, message: `${daysDiff} dager igjen` };
    }
  };

  // 🔧 FORENKLET: En funksjon for kategori-info
  const getCategoryInfo = () => {
    const categoryValue = task.category || 'Personlig';
    return categoryOptions.find(cat => cat.value === categoryValue) || categoryOptions[1];
  };

  const deadlineInfo = getDeadlineInfo();
  const categoryInfo = getCategoryInfo();
  const isCompleted = task.status === 'completed';

  return (
    <View style={styles.container}>
      {/* Rød bakgrunn når valgt for sletting */}
      {isSelected && (
        <View style={[styles.deleteBackground, { backgroundColor: theme.error }]}>
          <Text style={styles.deleteIcon}>🗑️</Text>
          <Text style={styles.deleteText}>Slett</Text>
        </View>
      )}
      
      {/* Hoved-kort */}
      <View style={[
        styles.card,
        { backgroundColor: theme.cardBackground },
        isCompleted && { opacity: 0.7 },
        !isCompleted && { borderLeftWidth: 4, borderLeftColor: deadlineInfo.color },
        isSelected && { marginRight: 80 }
      ]}>
        
        {/* 🔧 FORENKLET: Hovedinnhold som én TouchableOpacity */}
        <TouchableOpacity onPress={onPress} style={styles.content}>
          
          {/* Header med titel og indikator */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Text style={[
                styles.title,
                { color: theme.textPrimary },
                isCompleted && { 
                  textDecorationLine: 'line-through', 
                  color: theme.textTertiary 
                }
              ]}>
                {task.title}
              </Text>
              
              {isCompleted && (
                <Text style={[styles.completedIcon, { color: theme.completed }]}>✓</Text>
              )}
              
              {/* Deadline badge kun på aktive oppgaver */}
              {!isCompleted && deadlineInfo.badge && (
                <View style={[styles.badge, { backgroundColor: deadlineInfo.color }]}>
                  <Text style={styles.badgeText}>{deadlineInfo.badge}</Text>
                </View>
              )}
            </View>
            
            {/* 🔧 FORENKLET: Toggle-indikator */}
            <View style={[
              styles.indicator, 
              { backgroundColor: isDarkMode ? '#4a4a4a' : '#f0f0f0' }
            ]}>
              <Text style={[
                styles.indicatorText,
                { color: isSelected ? theme.error : theme.textTertiary }
              ]}>
                {isSelected ? '✕' : '⋯'}
              </Text>
            </View>
          </View>
          
          {/* Kategori */}
          <View style={[styles.categoryBadge, { backgroundColor: categoryInfo.color }]}>
            <Text style={styles.categoryText}>{categoryInfo.label}</Text>
          </View>
          
          {/* 🔧 FORENKLET: Oppgave-detaljer i enklere format */}
          <View style={styles.details}>
            <Text style={[styles.detail, { color: theme.textSecondary }]}>
              📅 {task.due_date} • ⚡ {task.priority}
            </Text>
            <Text style={[
              styles.detail, 
              { color: isCompleted ? theme.completed : theme.warning }
            ]}>
              {isCompleted ? '✅ Fullført' : '🔄 Aktiv'}
            </Text>
            
            {/* Deadline-melding kun på aktive oppgaver */}
            {!isCompleted && (
              <Text style={[
                styles.detail, 
                { color: deadlineInfo.color, fontWeight: '600' }
              ]}>
                ⏰ {deadlineInfo.message}
              </Text>
            )}
          </View>
        </TouchableOpacity>
        
        {/* 🔧 FORENKLET: Action-knapper i enklere layout */}
        <View style={styles.actions}>
          <TouchableOpacity 
            onPress={onEdit}
            style={[styles.actionButton, { backgroundColor: theme.info }]}
          >
            <Text style={styles.actionText}>✏️</Text>
          </TouchableOpacity>
          
          {isSelected && (
            <TouchableOpacity 
              onPress={onDelete}
              style={[styles.deleteButton, { backgroundColor: theme.error }]}
            >
              <Text style={styles.deleteButtonText}>🗑️</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    position: 'relative',
  },
  deleteBackground: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  deleteIcon: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 4,
  },
  deleteText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    borderRadius: 8,
    padding: 15,
    elevation: 3,
  },
  content: {
    flex: 1,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  completedIcon: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  badge: {
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  indicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  indicatorText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  details: {
    gap: 4,
  },
  detail: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  actionText: {
    fontSize: 16,
  },
  deleteButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    position: 'absolute',
    right: -70,
    top: -7,
  },
  deleteButtonText: {
    fontSize: 20,
    color: '#fff',
  },
});