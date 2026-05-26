import React from 'react';
import { useRouter } from 'expo-router';
import { TitleScreen } from '@/components/TitleScreen';

export default function Index() {
  const router = useRouter();

  const handleGameStart = () => {
    // ゲーム開始時の処理
    console.log('ゲームスタート！');
    // 後でゲーム画面へナビゲートする
    // router.push('/game');
  };

  return <TitleScreen onGameStart={handleGameStart} />;
}
