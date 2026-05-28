import React, { useState, useEffect, useRef } from 'react';
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
import { GameOverScreen } from './game/GameOverScreen';
import {
  getRandomBlockType,
  mergeBlockWithGrid,
  canMoveDown,
  moveBlockDown,
  fixBlockToGrid,
  createNewBlock,
  checkGameOver,
} from '@/utils/blockUtils';

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
    nextBlock: getRandomBlockType(),
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

  // ===== ゲーム落下ループの間隔（ミリ秒） =====
  const FALL_INTERVAL = 1000;

  // ===== 落下ループのタイマーID =====
  const fallIntervalRef = useRef<number | null>(null);

  // ===== ゲーム開始時の初期化 =====
  useEffect(() => {
    console.log('ゲーム画面が開始されました');

    // ===== 最初のブロックを生成 =====
    const firstBlock = createNewBlock(gameState.nextBlock);
    setCurrentBlock(firstBlock);

    // ===== 次のネクストブロックを生成 =====
    setGameState((prev) => ({
      ...prev,
      nextBlock: getRandomBlockType(),
    }));
  }, []);

  // ===== ブロック落下ループ =====
  useEffect(() => {
    if (!gameState.gameOver && !gameState.paused && currentBlock) {
      fallIntervalRef.current = setInterval(() => {
        setCurrentBlock((prevBlock) => {
          if (!prevBlock) return null;

          if (canMoveDown(prevBlock, grid)) {
            // ===== 下に移動できる =====
            return moveBlockDown(prevBlock);
          } else {
            // ===== ブロック着地処理 =====
            console.log(`ブロック着地：${prevBlock.type}型`);

            // ===== グリッドにブロックを固定 =====
            const newGrid = fixBlockToGrid(grid, prevBlock);
            setGrid(newGrid);

            // ===== ゲームオーバー判定 =====
            // グリッドの最上部に埋まっているブロックがあるかチェック
            if (checkGameOver(newGrid)) {
              console.log('ゲームオーバー！');
              // ===== ゲーム状態をゲームオーバーに設定 =====
              setGameState((prev) => ({
                ...prev,
                gameOver: true,
              }));
              return null; // 現在のブロックをクリア
            }

            // ===== 次のブロックを生成 =====
            const nextNewBlock = createNewBlock(gameState.nextBlock);
            setGameState((prev) => ({
              ...prev,
              nextBlock: getRandomBlockType(),
            }));

            return nextNewBlock;
          }
        });
      }, FALL_INTERVAL);
    }

    // ===== クリーンアップ =====
    return () => {
      if (fallIntervalRef.current) {
        clearInterval(fallIntervalRef.current);
      }
    };
  }, [gameState.gameOver, gameState.paused, currentBlock, grid, gameState.nextBlock]);

  // ===== グリッド描画用 =====
  const displayGrid = mergeBlockWithGrid(grid, currentBlock);

  // ===== リスタートボタン押下時の処理 =====
  const handleRestart = () => {
    console.log('ゲームをリスタートします');

    // ===== グリッドを初期化 =====
    setGrid(() => {
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

    // ===== ゲーム状態をリセット =====
    const firstBlock = createNewBlock(gameState.nextBlock);
    setCurrentBlock(firstBlock);

    setGameState({
      score: 0,
      lines: 0,
      level: 1,
      gameOver: false,
      paused: false,
      nextBlock: getRandomBlockType(),
      heldBlock: null,
    });
  };

  // ===== タイトルに戻るボタン押下時の処理 =====
  const handleReturnToTitle = () => {
    console.log('タイトルに戻ります');
    if (fallIntervalRef.current) {
      clearInterval(fallIntervalRef.current);
    }
    if (onGameEnd) {
      onGameEnd(gameState.score);
    }
    router.back();
  };

  // ===== タイトルに戻るボタン（ゲーム中用） =====
  const handleReturnTitleInGame = () => {
    console.log('タイトルに戻ります');
    if (fallIntervalRef.current) {
      clearInterval(fallIntervalRef.current);
    }
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
            onPress={handleReturnTitleInGame}
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

      {/* ===== ゲームオーバー画面 ===== */}
      {gameState.gameOver && (
        <GameOverScreen
          score={gameState.score}
          lines={gameState.lines}
          level={gameState.level}
          onRestart={handleRestart}
          onReturnToTitle={handleReturnToTitle}
        />
      )}
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
