import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router'; // 追加：ナビゲーション用
import { Header } from './Header';
import { StartButton } from './StartButton';
import { HighScoreList } from './HighScoreList';
import { Footer } from './Footer';
import { colors } from '@/styles/colors';
import { spacing } from '@/styles/spacing';
import { mockHighScores } from '@/data/mockHighScores';

interface TitleScreenProps {
  onGameStart?: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onGameStart }) => {
  const router = useRouter(); // ナビゲーションを取得

  const handleStartGame = () => {
    // ===== ゲーム開始時の処理 =====
    if (onGameStart) {
      onGameStart();
    }
    console.log('ゲーム画面に遷移します');
    
    // ゲーム画面へナビゲート
    router.push('./game');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* ヘッダー（タイトル） */}
        <Header />

        {/* スタートボタン */}
        <View style={styles.buttonContainer}>
          <StartButton onPress={handleStartGame} />
        </View>

        {/* ハイスコアリスト */}
        <HighScoreList scores={mockHighScores} />

        {/* スクロール時の下余白 */}
        <View style={styles.spacer} />
      </ScrollView>

      {/* フッター（常に下部に固定） */}
      <Footer />
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
  },
  contentContainer: {
    paddingVertical: spacing.lg,
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  spacer: {
    height: spacing.xl,
  },
});
