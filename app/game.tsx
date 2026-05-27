import React from 'react';
import { GameScreen } from '@/components/GameScreen';

export default function Game() {
  // ===== ゲーム終了時の処理 =====
  const handleGameEnd = (score: number) => {
    console.log(`ゲーム終了。スコア: ${score}`);
    // 後で、ハイスコアの更新処理などをここに実装
  };

  return <GameScreen onGameEnd={handleGameEnd} />;
}
