import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlockType } from '@/types/game';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import { spacing } from '@/styles/spacing';

interface NextBlockPreviewProps {
  nextBlock: BlockType;
}

export const NextBlockPreview: React.FC<NextBlockPreviewProps> = ({
  nextBlock,
}) => {
  // ===== ブロックタイプごとの色を取得 =====
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
      default:
        return colors.surface;
    }
  };

  return (
    <View style={styles.container}>
      {/* ネクストブロック欄のタイトル */}
      <Text style={styles.title}>ネクスト</Text>

      {/* 次のブロックを表示 */}
      <View
        style={[
          styles.preview,
          {
            backgroundColor: getBlockColor(nextBlock),
          },
        ]}
      >
        <Text style={styles.blockType}>{nextBlock}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    ...typography.body,
    color: colors.text,
    fontWeight: 'bold',
  },
  preview: {
    width: 80,
    height: 80,
    borderColor: colors.secondary,
    borderWidth: 2,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blockType: {
    ...typography.heading,
    color: colors.background,
    fontWeight: 'bold',
  },
});
