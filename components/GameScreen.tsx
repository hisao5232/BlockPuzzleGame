import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { GameState, Grid, BlockType, GridCell } from '@/types/game';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import { spacing } from '@/styles/spacing';
import { GameGrid } from './game/GameGrid';
import { NextBlockPreview } from './game/NextBlockPreview';
import { HoldBlockPreview } from './game/HoldBlockPreview';
import { ScoreDisplay } from './game/ScoreDisplay';

interface GameScreenProps {
  onGameEnd?: (score: number) => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ onGameEnd }) => {
  const router = useRouter();

  // ===== ゲーム状態の管理 =====
  // スコア、ライン数、レベル、ゲーム終了フラグ、ポーズ、次のブロック、ホールドブロック
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lines: 0,
    level: 1,
    gameOver: false,
    paused: false,
    nextBlock: BlockType.I,
    heldBlock: null,
  });

  // ===== グリッドの状態を管理（10×22） =====
  // 初期グリッドを作成（全て空の状態）
  const [grid, setGrid] = useState<Grid>(() => {
    return Array(22)
      .fill(null)
      .map(() =>
        Array(10)
          .fill(null)
          .map(() => ({
            type: BlockType.None,
            filled: false,
          }))
      );
  });

  // ===== ゲーム開始時の初期化 =====
  useEffect(() => {
    console.log('ゲーム画面が開始されました');
    // 後で、ゲームロジックのループをここに実装
  }, []);

  // ===== スタートボタン押下時の処理 =====
  const handleReturnToTitle = () => {
    console.log('タイトルに戻ります');
    // ゲーム終了時のスコア処理
    if (onGameEnd) {
      onGameEnd(gameState.score);
    }
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* ===== ヘッダー：タイトルとボタン ===== */}
        <View style={styles.header}>
          <Text style={styles.title}>ブロックパズル</Text>
          {/* タイトルに戻るボタン */}
          <TouchableOpacity
            style={styles.returnButton}
            onPress={handleReturnToTitle}
          >
            <Text style={styles.returnButtonText}>戻る</Text>
          </TouchableOpacity>
        </View>

        {/* ===== メインゲームエリア ===== */}
        <View style={styles.gameContainer}>
          {/* ===== 左側：ホールド欄 ===== */}
          <View style={styles.leftPanel}>
            <HoldBlockPreview heldBlock={gameState.heldBlock} />
          </View>

          {/* ===== 中央：ゲームグリッド ===== */}
          <View style={styles.centerPanel}>
            <GameGrid grid={grid} />
          </View>

          {/* ===== 右側：スコア・ネクストブロック ===== */}
          <View style={styles.rightPanel}>
            <View style={styles.nextBlockContainer}>
              <NextBlockPreview nextBlock={gameState.nextBlock} />
            </View>
          </View>
        </View>

        {/* ===== フッター：スコア表示（左下） ===== */}
        <View style={styles.footer}>
          <ScoreDisplay
            score={gameState.score}
            lines={gameState.lines}
            level={gameState.level}
          />
        </View>
      </View>   
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },

  // ===== ヘッダースタイル =====
  header: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
marginBottom: spacing.lg,
paddingBottom: spacing.md,
paddingHorizontal: spacing.md,
borderBottomColor: colors.surface,
borderBottomWidth: 1,
},
title: {
...typography.heading,
color: colors.primary,
flex: 1, // タイトルが左に寄るように
},
returnButton: {
backgroundColor: colors.secondary,
paddingVertical: spacing.sm,
paddingHorizontal: spacing.md,
borderRadius: 8,
marginLeft: spacing.md,
},
returnButtonText: {
...typography.body,
color: colors.text,
fontWeight: 'bold',
},

  // ===== メインゲームエリア =====
  gameContainer: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },

  // ===== 左側パネル（ホールド欄） =====
  leftPanel: {
    justifyContent: 'flex-start',
    paddingRight: spacing.sm,
  },

  // ===== 中央パネル（ゲームグリッド） =====
  centerPanel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ===== 右側パネル（ネクストのみ） =====
rightPanel: {
  justifyContent: 'flex-start',
  paddingLeft: spacing.sm,
},

// ===== ネクストブロックコンテナ =====
  nextBlockContainer: {
    marginTop: spacing.lg,
  },

  // ===== フッター（左下にスコア表示） =====
footer: {
  paddingTop: spacing.md,
  paddingBottom: spacing.md,
  borderTopColor: colors.surface,
  borderTopWidth: 1,
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
},
  footerText: {
    ...typography.body,
    color: colors.accent,
    fontWeight: 'bold',
  },
});
