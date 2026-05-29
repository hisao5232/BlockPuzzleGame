import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import { spacing } from '@/styles/spacing';

interface MoveButtonsProps {
  onLeftPress: () => void;   // 左矢印ボタン押下時の処理
  onRightPress: () => void;  // 右矢印ボタン押下時の処理
}

export const MoveButtons: React.FC<MoveButtonsProps> = ({
  onLeftPress,
  onRightPress,
}) => {
  return (
    <View style={styles.container}>
      {/* ===== 左矢印ボタン ===== */}
      <TouchableOpacity
        style={styles.button}
        onPress={onLeftPress}
        activeOpacity={0.7}
      >
        <Text style={styles.arrow}>←</Text>
      </TouchableOpacity>

      {/* ===== 右矢印ボタン ===== */}
      <TouchableOpacity
        style={styles.button}
        onPress={onRightPress}
        activeOpacity={0.7}
      >
        <Text style={styles.arrow}>→</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // ===== ボタンコンテナ（左右のボタンを並べる） =====
  container: {
    flexDirection: 'row',
    gap: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ===== 個別のボタンスタイル =====
  button: {
    backgroundColor: colors.secondary, // ターコイズ
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  // ===== 矢印テキスト =====
  arrow: {
    ...typography.title,
    color: colors.text,
    fontWeight: 'bold',
  },
});
