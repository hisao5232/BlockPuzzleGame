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
            if (checkGameOver(newGrid)) {
              console.log('ゲームオーバー！');
              setGameState((prev) => ({
                ...prev,
                gameOver: true,
              }));
              return null;
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

  // ===== 左移動ボタン押下時の処理 =====
  const handleMoveLeft = () => {
    setCurrentBlock((prevBlock) => {
      if (!prevBlock) return null;

      // ===== 左に移動できるかチェック =====
      if (canMoveLeft(prevBlock, grid)) {
        console.log('左に移動');
        return moveBlockLeft(prevBlock);
      } else {
        console.log('左に移動できません');
        return prevBlock; // 動かない
      }
    });
  };

  // ===== 右移動ボタン押下時の処理 =====
  const handleMoveRight = () => {
    setCurrentBlock((prevBlock) => {
      if (!prevBlock) return null;

      // ===== 右に移動できるかチェック =====
      if (canMoveRight(prevBlock, grid)) {
        console.log('右に移動');
        return moveBlockRight(prevBlock);
      } else {
        console.log('右に移動できません');
        return prevBlock; // 動かない
      }
    });
  };

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
