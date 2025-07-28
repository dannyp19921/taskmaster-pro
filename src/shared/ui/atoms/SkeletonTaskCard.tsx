// /src/shared/ui/atoms/SkeletonTaskCard.tsx - Modern loading skeleton! ⏳

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

interface SkeletonTaskCardProps {
  testID?: string;
}

export const SkeletonTaskCard: React.FC<SkeletonTaskCardProps> = ({
  testID = "skeleton-task-card",
}) => {
  const { theme } = useTheme();
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  // 🌊 Shimmer animation effect
  useEffect(() => {
    const shimmer = () => {
      shimmerAnimation.setValue(0);
      Animated.timing(shimmerAnimation, {
        toValue: 1,
        duration: 1500,
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
    outputRange: [0.3, 0.7, 0.3],
  });

  // 🔘 Skeleton element component
  const SkeletonElement = ({ 
    width, 
    height, 
    borderRadius = 4, 
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

  return (
    <View style={styles.container} testID={testID}>
      <View style={[
        styles.card,
        { 
          backgroundColor: theme.cardBackground,
          borderColor: theme.border,
        }
      ]}>
        
        {/* 📝 Title skeleton */}
        <View style={styles.titleRow}>
          <SkeletonElement width="70%" height={20} borderRadius={4} />
          <SkeletonElement width={30} height={30} borderRadius={15} />
        </View>
        
        {/* 🏷️ Category badge skeleton */}
        <SkeletonElement 
          width={80} 
          height={24} 
          borderRadius={12} 
          style={styles.categoryBadge}
        />
        
        {/* 📅 Date and status skeleton */}
        <View style={styles.statusRow}>
          <SkeletonElement width="45%" height={16} borderRadius={4} />
          <SkeletonElement width="35%" height={16} borderRadius={4} />
        </View>
        
        {/* ⏰ Deadline message skeleton */}
        <SkeletonElement 
          width="60%" 
          height={14} 
          borderRadius={4} 
          style={styles.deadlineMessage}
        />
        
        {/* 🎛️ Action buttons skeleton */}
        <View style={styles.actionsRow}>
          <SkeletonElement width={32} height={32} borderRadius={16} />
          <SkeletonElement width={32} height={32} borderRadius={16} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  card: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryBadge: {
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  deadlineMessage: {
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    alignSelf: 'flex-end',
  },
});