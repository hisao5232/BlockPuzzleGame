import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import { spacing } from '@/styles/spacing';

interface GameOverScreenProps {
  score: number;              // 最終スコア
  lines: number;              // 消したライン数
  level: number;              // 最終レベル
  onRestart: () => void;      // リスタートボタン押下時の処理
  onReturnToTitle: () => void; // タイトルに戻るボタン押下時の処理
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  lines,
  level,
  onRestart,
  onReturnToTitle,
}) => {
  return (
    // ===== モーダル背景（黒い半透明） =====
    // ゲームオーバー画面を目立たせるための背景
    <Modal transparent={true} animationType="fade">
      <View style={styles.backdrop}>
        {/* ===== ゲームオーバーコンテナ ===== */}
        <View style={styles.container}>
          {/* ===== タイトル ===== */}
          <Text style={styles.gameOverText}>GAME OVER</Text>

          {/* ===== スコア情報 ===== */}
          <View style={styles.scoreContainer}>
            {/* スコア */}
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>最終スコア</Text>
              <Text style={styles.scoreValue}>
                {score.toLocaleString()}
              </Text>
            </View>

            {/* 消したライン数 */}
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>ライン数</Text>
              <Text style={styles.scoreValue}>{lines}</Text>
            </View>

            {/* 最終レベル */}
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>レベル</Text>
              <Text style={styles.scoreValue}>{level}</Text>
            </View>
          </View>

          {/* ===== ボタンエリア ===== */}
          <View style={styles.buttonContainer}>
            {/* リスタートボタン */}
            <TouchableOpacity
              style={[styles.button, styles.restartButton]}
              onPress={onRestart}
            >
              <Text style={styles.buttonText}>リスタート</Text>
            </TouchableOpacity>

            {/* タイトルに戻るボタン */}
            <TouchableOpacity
              style={[styles.button, styles.titleButton]}
              onPress={onReturnToTitle}
            >
              <Text style={styles.buttonText}>タイトルに戻る</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // ===== 背景（半透明の黒） =====
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // 黒（透明度70%）
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ===== ゲームオーバーコンテナ =====
  container: {
    backgroundColor: colors.background,
    borderColor: colors.primary,
    borderWidth: 3,
    borderRadius: 16,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    width: '80%',
  },

  // ===== ゲームオーバーテキスト =====
  gameOverText: {
    ...typography.title,
    color: colors.error, // 赤色で目立たせる
    marginBottom: spacing.xl,
    textAlign: 'center',
  },

  // ===== スコア情報コンテナ =====
  scoreContainer: {
    backgroundColor: colors.surface,
    borderColor: colors.accent,
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xl,
    width: '100%',
  },

  // ===== スコア1項目 =====
  scoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomColor: colors.background,
    borderBottomWidth: 1,
  },

  // ===== スコアラベル（「最終スコア」など） =====
  scoreLabel: {
    ...typography.body,
    color: colors.text,
    fontWeight: 'bold',
  },

  // ===== スコア数値 =====
  scoreValue: {
    ...typography.heading,
    color: colors.accent,
  },

  // ===== ボタンコンテナ =====
  buttonContainer: {
    gap: spacing.md,
    width: '100%',
  },

  // ===== ボタン共通スタイル =====
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ===== リスタートボタン（プライマリカラー） =====
  restartButton: {
    backgroundColor: colors.primary, // 赤
  },

  // ===== タイトルに戻るボタン（セカンダリカラー） =====
  titleButton: {
    backgroundColor: colors.secondary, // ターコイズ
  },

  // ===== ボタンテキスト =====
  buttonText: {
    ...typography.heading,
    color: colors.text,
    fontWeight: 'bold',
  },
});
