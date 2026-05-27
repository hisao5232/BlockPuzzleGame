import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { GameState, Grid, BlockType, GridCell, CurrentBlock } from '@/types/game';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import { spacing } from '@/styles/spacing';
import { GameGrid } from './game/GameGrid';
import { NextBlockPreview } from './game/NextBlockPreview';
import { HoldBlockPreview } from './game/HoldBlockPreview';
import { ScoreDisplay } from './game/ScoreDisplay';
import { getRandomBlockType, mergeBlockWithGrid } from '@/utils/blockUtils';

interface GameScreenProps {
  onGameEnd?: (score: number) => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ onGameEnd }) => {
  const router = useRouter();

  // ===== ゲーム状態の管理 =====
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lines: 0,
    level: 1,
    gameOver: false,
    paused: false,
    nextBlock: getRandomBlockType(), // 最初のネクストブロックをランダム生成
    heldBlock: null,
  });

  // ===== グリッドの状態を管理（10×22） =====
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

  // ===== 現在落下中のブロック =====
  const [currentBlock, setCurrentBlock] = useState<CurrentBlock | null>(null);

  // ===== ゲーム開始時の初期化 =====
  useEffect(() => {
    console.log('ゲーム画面が開始されました');
    
    // ===== 最初のブロックを生成して落下開始 =====
    const firstBlock: CurrentBlock = {
      type: gameState.nextBlock,
      row: 0,                    // 上から落下開始
      column: Math.floor(10 / 2 - 1), // 中央に配置（10マスの中心）
      rotation: 0,               // 回転状態なし
    };
    setCurrentBlock(firstBlock);

    // ===== 次のブロックをランダムに決定 =====
    setGameState((prev) => ({
      ...prev,
      nextBlock: getRandomBlockType(),
    }));
  }, []);

  // ===== グリッド描画用（落下中のブロックを含める） =====
  // currentBlockをグリッドにマージして表示
  const displayGrid = mergeBlockWithGrid(grid, currentBlock);

  // ===== タイトルに戻るボタン押下時の処理 =====
  const handleReturnToTitle = () => {
    console.log('タイトルに戻ります');
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
            {/* displayGridを使用して、落下中のブロックを含める */}
            <GameGrid grid={displayGrid} />
          </View>

          {/* ===== 右側：ネクストブロック ===== */}
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

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomColor: colors.surface,
    borderBottomWidth: 1,
  },
  title: {
    ...typography.heading,
    color: colors.primary,
    flex: 1,
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

  gameContainer: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },

  leftPanel: {
    justifyContent: 'flex-start',
    paddingRight: spacing.sm,
  },

  centerPanel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  rightPanel: {
    justifyContent: 'flex-start',
    paddingLeft: spacing.sm,
  },

  nextBlockContainer: {
    marginTop: spacing.lg,
  },

  footer: {
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderTopColor: colors.surface,
    borderTopWidth: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});
