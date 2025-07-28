// /src/shared/ui/organisms/SkeletonDashboard.tsx - Dashboard loading skeleton! 📊

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

interface SkeletonDashboardProps {
  testID?: string;
}

export const SkeletonDashboard: React.FC<SkeletonDashboardProps> = ({
  testID = "skeleton-dashboard",
}) => {
  const { theme } = useTheme();
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  // 🌊 Shimmer animation effect
  useEffect(() => {
    const shimmer = () => {
      shimmerAnimation.setValue(0);
      Animated.timing(shimmerAnimation, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      }).start(() => {
        shimmer(); // Loop the animation
      });
    };
    
    shimmer();
    
    return () => {
      shimmerAnimation.stopAnimation();
    };
  }, [shimmerAnimation]);

  // 🎨 Shimmer opacity animation
  const shimmerOpacity = shimmerAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.2, 0.6, 0.2],
  });

  // 🔘 Skeleton element component
  const SkeletonElement = ({ 
    width, 
    height, 
    borderRadius = 8, 
    style 
  }: { 
    width: number | string; 
    height: number; 
    borderRadius?: number;
    style?: any;
  }) => (
    <Animated.View
      style={{
        width,
        height,
        backgroundColor: theme.border,
        borderRadius,
        opacity: shimmerOpacity,
        ...style,
      }}
    />
  );

  // 📊 StatCard skeleton
  const SkeletonStatCard = () => (
    <View style={[
      styles.statCard,
      { 
        backgroundColor: theme.cardBackground,
        borderColor: theme.border,
      }
    ]}>
      <SkeletonElement width="60%" height={14} style={styles.statTitle} />
      <SkeletonElement width="40%" height={32} style={styles.statValue} />
      <SkeletonElement width="80%" height={12} />
    </View>
  );

  return (
    <View style={styles.container} testID={testID}>
      {/* 📱 Header skeleton */}
      <View style={styles.headerSection}>
        <SkeletonElement width="50%" height={28} borderRadius={6} />
        <SkeletonElement width="70%" height={16} borderRadius={4} style={styles.subtitle} />
      </View>

      {/* 📊 Stats Grid skeleton */}
      <View style={styles.section}>
        <SkeletonElement width="40%" height={20} style={styles.sectionTitle} />
        
        <View style={styles.statsGrid}>
          <SkeletonStatCard />
          <SkeletonStatCard />
        </View>
        
        <View style={styles.statsGrid}>
          <SkeletonStatCard />
          <SkeletonStatCard />
        </View>

        {/* Progress bar skeleton */}
        <View style={[
          styles.progressSection,
          { 
            backgroundColor: theme.cardBackground,
            borderColor: theme.border,
          }
        ]}>
          <SkeletonElement width="50%" height={16} style={styles.progressTitle} />
          <View style={styles.progressRow}>
            <SkeletonElement width="70%" height={8} borderRadius={4} />
            <SkeletonElement width="15%" height={16} borderRadius={4} />
          </View>
        </View>
      </View>

      {/* ⏰ Upcoming section skeleton */}
      <View style={styles.section}>
        <SkeletonElement width="60%" height={20} style={styles.sectionTitle} />
        
        <View style={styles.statsGrid}>
          <SkeletonStatCard />
          <SkeletonStatCard />
        </View>
      </View>

      {/* 🏷️ Categories section skeleton */}
      <View style={styles.section}>
        <SkeletonElement width="45%" height={20} style={styles.sectionTitle} />
        
        {[1, 2, 3].map(index => (
          <View 
            key={index}
            style={[
              styles.categoryItem,
              { 
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
              }
            ]}
          >
            <SkeletonElement width={12} height={12} borderRadius={6} />
            <SkeletonElement width="60%" height={16} style={styles.categoryLabel} />
            <SkeletonElement width="15%" height={16} />
          </View>
        ))}
      </View>

      {/* 🚀 Action buttons skeleton */}
      <View style={styles.actionSection}>
        <SkeletonElement width="50%" height={20} style={styles.sectionTitle} />
        <SkeletonElement width="100%" height={48} borderRadius={8} style={styles.actionButton} />
        <SkeletonElement width="100%" height={48} borderRadius={8} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerSection: {
    marginBottom: 24,
  },
  subtitle: {
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statTitle: {
    marginBottom: 8,
  },
  statValue: {
    marginBottom: 8,
  },
  progressSection: {
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressTitle: {
    marginBottom: 12,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryLabel: {
    flex: 1,
    marginLeft: 12,
  },
  actionSection: {
    marginBottom: 24,
  },
  actionButton: {
    marginBottom: 12,
  },
});