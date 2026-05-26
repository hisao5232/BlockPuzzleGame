import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import { spacing } from '@/styles/spacing';

export const Footer: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>go-pro-world.net since 2026</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: colors.surface,
    borderTopWidth: 1,
  },
  text: {
    ...typography.small,
    color: colors.textSecondary,
  },
});
