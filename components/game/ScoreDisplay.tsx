import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import { spacing } from '@/styles/spacing';

interface ScoreDisplayProps {
  score: number;    // 現在のスコア
  lines: number;    // 消したライン数
  level: number;    // 現在のレベル
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  lines,
  level,
}) => {
  return (
    <View style={styles.container}>
      {/* ===== スコア表示 ===== */}
      <View style={styles.scoreItem}>
        <Text style={styles.label}>スコア</Text>
        <Text style={styles.value}>{score.toLocaleString()}</Text>
      </View>

      {/* ===== ライン数表示 ===== */}
      <View style={styles.scoreItem}>
        <Text style={styles.label}>ライン</Text>
        <Text style={styles.value}>{lines}</Text>
      </View>

      {/* ===== レベル表示 ===== */}
      <View style={styles.scoreItem}>
        <Text style={styles.label}>レベル</Text>
        <Text style={styles.value}>{level}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderColor: colors.accent,
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  // ===== スコア項目（スコア、ライン、レベル）のスタイル =====
  scoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.sm,
    borderBottomColor: colors.background,
    borderBottomWidth: 1,
  },
  label: {
    ...typography.body,
    color: colors.text,
    fontWeight: 'bold',
  },
  value: {
    ...typography.heading,
    color: colors.accent,
  },
});
