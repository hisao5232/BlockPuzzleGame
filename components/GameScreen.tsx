import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { GameState, Grid, BlockType, CurrentBlock } from '@/types/game';
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

  // ===== currentBlockを初期値で初期化 =====
  const [currentBlock, setCurrentBlock] = useState<CurrentBlock | null>(() => {
    // 初期ブロックを直接生成
    return createNewBlock(BlockType.I);
  });

  const [isInitialized, setIsInitialized] = useState(false);

  const FALL_INTERVAL = 1000;
  const fallIntervalRef = useRef<number | null>(null);
  const gridRef = useRef<Grid>(grid);

  // ===== gridが更新されたらRefも更新 =====
  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  // ===== ゲーム開始時の初期化 =====
  useEffect(() => {
    console.log('ゲーム画面が開始されました');
    console.log('currentBlock:', currentBlock);

    // ===== ゲーム状態を初期化 =====
    setGameState((prev) => ({
      ...prev,
      nextBlock: getRandomBlockType(),
    }));

    // ===== 初期化完了を通知 =====
    setTimeout(() => {
      console.log('初期化完了、落下ループ開始準備');
      setIsInitialized(true);
    }, 100); // 100ms後に初期化完了を通知
  }, []);

  // ===== 落下ループを開始（初期化完了後） =====
  useEffect(() => {
    // ===== 初期化がまだ完了していなければ開始しない =====
    if (!isInitialized) {
      console.log('初期化待ち...');
      return;
    }

    if (!currentBlock) {
      console.log('currentBlockがnullのため、落下ループを開始しません');
      return;
    }

    if (gameState.gameOver || gameState.paused) {
      console.log('ゲーム終了またはポーズ状態');
      return;
    }

    console.log('🎮 落下ループを開始します:', currentBlock);

    // ===== 既存のタイマーをクリア =====
    if (fallIntervalRef.current) {
      clearInterval(fallIntervalRef.current);
    }

    // ===== 新しいタイマーを設定 =====
    fallIntervalRef.current = setInterval(() => {
      setCurrentBlock((prevBlock) => {
        if (!prevBlock) return null;

        // ===== gridRefの最新値を使用 =====
        if (canMoveDown(prevBlock, gridRef.current)) {
          return moveBlockDown(prevBlock);
        } else {
          // ===== ブロック着地処理 =====
          console.log(`ブロック着地：${prevBlock.type}型`);

          // ===== グリッドにブロックを固定 =====
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

          return null;
        }
      });
    }, FALL_INTERVAL);

    console.log('タイマーID:', fallIntervalRef.current);

    // ===== クリーンアップ =====
    return () => {
      if (fallIntervalRef.current) {
        clearInterval(fallIntervalRef.current);
      }
    };
  }, [isInitialized, gameState.gameOver, gameState.paused]);

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
    router.push('/');
  };

  const handleReturnTitleInGame = () => {
    console.log('タイトルに戻ります');
    if (fallIntervalRef.current) {
      clearInterval(fallIntervalRef.current);
    }
    if (onGameEnd) {
      onGameEnd(gameState.score);
    }
    router.push('/');
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
    justifyContent: 'space-between',
    paddingRight: spacing.sm,
    alignItems: 'center',
  },

  centerPanel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  rightPanel: {
    justifyContent: 'space-between',
    paddingLeft: spacing.sm,
    alignItems: 'center',
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
