import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HighScore } from '@/types/game';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import { spacing } from '@/styles/spacing';

interface HighScoreListProps {
  scores: HighScore[];
}

export const HighScoreList: React.FC<HighScoreListProps> = ({ scores }) => {
  return (
    <View style={styles.container}>
      {/* ハイスコアタイトル */}
      <Text style={styles.title}>ハイスコア ベスト3</Text>

      {/* スコアリスト */}
      <View style={styles.listContainer}>
        {scores.map((score, index) => (
          <View
            key={score.rank}
            style={[
              styles.scoreItem,
              // 最後のアイテムには下線を付けない
              index === scores.length - 1 && styles.lastItem,
            ]}
          >
            {/* 順位 */}
            <Text style={styles.rank}>#{score.rank}</Text>

            {/* プレイヤー名とスコア */}
            <View style={styles.infoContainer}>
              <Text style={styles.playerName}>{score.playerName}</Text>
              <Text style={styles.score}>{score.score.toLocaleString()}</Text>
            </View>

            {/* 日付 */}
            <Text style={styles.date}>{score.date}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  title: {
    ...typography.subtitle,
    color: colors.accent,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  listContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    borderColor: colors.primary,
    borderWidth: 2,
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomColor: colors.background,
    borderBottomWidth: 1,
  },
  lastItem: {
    borderBottomWidth: 0, // 最後の項目は下線なし
  },
  rank: {
    ...typography.heading,
    color: colors.primary,
    minWidth: 50,
    textAlign: 'center',
  },
  infoContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  playerName: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  score: {
    ...typography.subtitle,
    color: colors.accent,
  },
  date: {
    ...typography.small,
    color: colors.textSecondary,
  },
});
