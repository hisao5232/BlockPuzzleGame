import React, { useState, useEffect, useRef, useCallback} from 'react';
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
import { MoveButtons } from './game/MoveButtons';
import {
  getRandomBlockType,
  mergeBlockWithGrid,
  canMoveDown,
  moveBlockDown,
  fixBlockToGrid,
  createNewBlock,
  checkGameOver,
  canMoveLeft,
  canMoveRight,
  moveBlockLeft,
  moveBlockRight,
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

  const [currentBlock, setCurrentBlock] = useState<CurrentBlock | null>(null);

  const FALL_INTERVAL = 1000;
  const fallIntervalRef = useRef<number | null>(null);

  // ===== ゲーム開始時の初期化 =====
  useEffect(() => {
    console.log('ゲーム画面が開始されました');

    const firstBlock = createNewBlock(gameState.nextBlock);
    setCurrentBlock(firstBlock);

    setGameState((prev) => ({
      ...prev,
      nextBlock: getRandomBlockType(),
    }));
  }, []);

  // ===== ブロック落下ループ =====
  // gridが変更されたときだけ再実行（ブロック固定時）
  useEffect(() => {
    console.log('落下ループ開始:', {
    gameOver: gameState.gameOver,
    paused: gameState.paused,
    currentBlock: currentBlock,
  });

    if (!gameState.gameOver && !gameState.paused && currentBlock) {
      console.log('タイマーを設定します');

      // ===== 既存のタイマーをクリア =====
      if (fallIntervalRef.current) {
        clearInterval(fallIntervalRef.current);
      }

      // ===== 新しいタイマーを設定 =====
      fallIntervalRef.current = setInterval(() => {
        console.log('タイマーコールバック実行');
        
        setCurrentBlock((prevBlock) => {
          console.log('prevBlock:', prevBlock);
          console.log('grid:', grid);
          
          if (!prevBlock) return null;

          // ===== ブロックが下に移動できるかチェック =====
          if (canMoveDown(prevBlock, grid)) {
            console.log('下に移動');

            return moveBlockDown(prevBlock);
          } else {
            // ===== ブロック着地処理 =====
            console.log(`ブロック着地：${prevBlock.type}型`);

            // ===== グリッドにブロックを固定（setGridで次のuseEffectトリガー） =====
            setGrid((prevGrid) => {
              const newGrid = fixBlockToGrid(prevGrid, prevBlock);

              // ===== ゲームオーバー判定 =====
              if (checkGameOver(newGrid)) {
                console.log('ゲームオーバー！');
                setGameState((prev) => ({
                  ...prev,
                  gameOver: true,
                }));
              }

              return newGrid;
            });

            // ===== 次のブロックを生成 =====
            setGameState((prev) => {
              const nextNewBlock = createNewBlock(prev.nextBlock);
              setCurrentBlock(nextNewBlock);

              return {
                ...prev,
                nextBlock: getRandomBlockType(),
              };
            });

            return null; // 現在のブロックはクリア
          }
        });
      }, FALL_INTERVAL);
      console.log('タイマーID:', fallIntervalRef.current);
  } else {
    console.log('タイマー設定をスキップ');
  }

    // ===== クリーンアップ =====
    return () => {
      if (fallIntervalRef.current) {
        clearInterval(fallIntervalRef.current);
      }
    };
  }, [gameState.gameOver, gameState.paused]); // ===== gameStateの開始/停止フラグのみ依存 =====

  // ===== グリッド描画用 =====
  const displayGrid = mergeBlockWithGrid(grid, currentBlock);

  // ===== 左移動ボタン押下時の処理 =====
  const handleMoveLeft = () => {
    setCurrentBlock((prevBlock) => {
      if (!prevBlock) return null;

      if (canMoveLeft(prevBlock, grid)) {
        console.log('左に移動');
        return moveBlockLeft(prevBlock);
      } else {
        console.log('左に移動できません');
        return prevBlock;
      }
    });
  };

  // ===== 右移動ボタン押下時の処理 =====
  const handleMoveRight = () => {
    setCurrentBlock((prevBlock) => {
      if (!prevBlock) return null;

      if (canMoveRight(prevBlock, grid)) {
        console.log('右に移動');
        return moveBlockRight(prevBlock);
      } else {
        console.log('右に移動できません');
        return prevBlock;
      }
    });
  };

  // ===== リスタートボタン押下時の処理 =====
  const handleRestart = () => {
    console.log('ゲームをリスタートします');

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

    const nextGameState = {
      score: 0,
      lines: 0,
      level: 1,
      gameOver: false,
      paused: false,
      nextBlock: getRandomBlockType(),
      heldBlock: null,
    };
    setGameState(nextGameState);

    const firstBlock = createNewBlock(nextGameState.nextBlock);
    setCurrentBlock(firstBlock);
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
          {/* ===== 左側：ホールド欄 + 左移動ボタン ===== */}
          <View style={styles.leftPanel}>
            <HoldBlockPreview heldBlock={gameState.heldBlock} />
            {/* 左移動ボタン */}
            <TouchableOpacity
              style={styles.moveButton}
              onPress={handleMoveLeft}
              activeOpacity={0.7}
            >
              <Text style={styles.moveButtonArrow}>←</Text>
            </TouchableOpacity>
          </View>

          {/* ===== 中央：ゲームグリッド ===== */}
          <View style={styles.centerPanel}>
            <GameGrid grid={displayGrid} />
          </View>

          {/* ===== 右側：ネクストブロック + 右移動ボタン ===== */}
          <View style={styles.rightPanel}>
            <View style={styles.nextBlockContainer}>
              <NextBlockPreview nextBlock={gameState.nextBlock} />
            </View>
            {/* 右移動ボタン */}
            <TouchableOpacity
              style={styles.moveButton}
              onPress={handleMoveRight}
              activeOpacity={0.7}
            >
              <Text style={styles.moveButtonArrow}>→</Text>
            </TouchableOpacity>
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
    gap: spacing.md,
    alignItems: 'stretch',
  },

  leftPanel: {
    justifyContent: 'space-between', // 上下に配置を分ける
    paddingRight: spacing.sm,
    alignItems: 'center', // 左ボタンを中央に配置
  },

  centerPanel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  rightPanel: {
    justifyContent: 'space-between', // 上下に配置を分ける
    paddingLeft: spacing.sm,
    alignItems: 'center', // 右ボタンを中央に配置
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

  // ===== 左右移動ボタン =====
moveButton: {
  backgroundColor: colors.secondary,
  width: 50,
  height: 50,
  borderRadius: 10,
  justifyContent: 'center',
  alignItems: 'center',
  elevation: 5,
  shadowColor: colors.secondary,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
},

moveButtonArrow: {
  ...typography.heading,
  color: colors.text,
  fontWeight: 'bold',
  fontSize: 24,
},

});
