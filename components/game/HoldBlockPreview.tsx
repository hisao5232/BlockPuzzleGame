import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlockType } from '@/types/game';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import { spacing } from '@/styles/spacing';

interface HoldBlockPreviewProps {
  heldBlock: BlockType | null;
}

export const HoldBlockPreview: React.FC<HoldBlockPreviewProps> = ({
  heldBlock,
}) => {
  // ===== ブロックタイプごとの色を取得 =====
  const getBlockColor = (blockType: BlockType | null): string => {
    if (!blockType) return colors.surface;
    switch (blockType) {
      case BlockType.I:
        return '#00F0F1';
      case BlockType.O:
        return '#FFED4E';
      case BlockType.T:
        return '#A945D9';
      case BlockType.S:
        return '#00FA5A';
      case BlockType.Z:
        return '#FF4555';
      case BlockType.J:
        return '#0066FF';
      case BlockType.L:
        return '#FF8C00';
      default:
        return colors.surface;
    }
  };

  return (
    <View style={styles.container}>
      {/* ホールド欄のタイトル */}
      <Text style={styles.title}>ホールド</Text>

      {/* ホールドしているブロックを表示 */}
      <View
        style={[
          styles.preview,
          {
            backgroundColor: getBlockColor(heldBlock),
          },
        ]}
      >
        {!heldBlock && (
          <Text style={styles.emptyText}>-</Text>
        )}
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
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...typography.heading,
    color: colors.textSecondary,
  },
});
