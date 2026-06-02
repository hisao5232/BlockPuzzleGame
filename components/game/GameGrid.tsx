import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Grid, BlockType } from '@/types/game';
import { colors } from '@/styles/colors';
import { getRotatedBlockShape } from '@/utils/blockUtils';

interface GameGridProps {
  grid: Grid; // 10×22のグリッド
  currentBlockForDisplay?: any; // displayGridの計算に使うため
}

export const GameGrid: React.FC<GameGridProps> = ({ grid }) => {
  // ===== グリッドの寸法を計算 =====
  // 画面幅から適切なグリッドサイズを計算
  const screenWidth = Dimensions.get('window').width;
  const gridWidth = screenWidth * 0.4; // 画面幅の40%
  const cellSize = gridWidth / 10; // 10マスなので各セルのサイズを計算

  // ===== ブロックタイプごとの色を定義 =====
  const getBlockColor = (blockType: BlockType): string => {
    switch (blockType) {
      case BlockType.I:
        return '#00F0F1'; // 水色
      case BlockType.O:
        return '#FFED4E'; // 黄色
      case BlockType.T:
        return '#A945D9'; // 紫
      case BlockType.S:
        return '#00FA5A'; // 緑
      case BlockType.Z:
        return '#FF4555'; // 赤
      case BlockType.J:
        return '#0066FF'; // 青
      case BlockType.L:
        return '#FF8C00'; // オレンジ
      case BlockType.None:
      default:
        return colors.surface; // グレー
    }
  };

  return (
    <View style={[styles.grid, { width: gridWidth }]}>
      {/* ===== グリッドのマスを描画（22行×10列） ===== */}
      {grid.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => (
            <View
              key={`${rowIndex}-${colIndex}`}
              style={[
                styles.cell,
                {
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: getBlockColor(cell.type),
                },
              ]}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  // ===== グリッド全体のスタイル =====
  grid: {
    backgroundColor: colors.background,
    borderColor: colors.primary,
    borderWidth: 2,
    overflow: 'hidden',
  },
  // ===== 1行分のスタイル =====
  row: {
    flexDirection: 'row',
  },
  // ===== 1マスのスタイル =====
  cell: {
    borderColor: colors.background,
    borderWidth: 1,
  },
});
