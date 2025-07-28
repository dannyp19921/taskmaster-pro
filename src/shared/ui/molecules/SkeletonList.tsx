// /src/shared/ui/molecules/SkeletonList.tsx - List loading skeleton! 📋

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SkeletonTaskCard } from '../atoms/SkeletonTaskCard';

interface SkeletonListProps {
  count?: number;
  itemComponent?: React.ComponentType<any>;
  testID?: string;
}

export const SkeletonList: React.FC<SkeletonListProps> = ({
  count = 5,
  itemComponent: ItemComponent = SkeletonTaskCard,
  testID = "skeleton-list",
}) => {
  // 📋 Generate skeleton items
  const skeletonItems = Array.from({ length: count }, (_, index) => (
    <ItemComponent key={index} testID={`${testID}-item-${index}`} />
  ));

  return (
    <View style={styles.container} testID={testID}>
      {skeletonItems}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});