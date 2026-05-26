// ゲーム全体で使う型定義
export interface HighScore {
  rank: number;
  score: number;
  playerName: string;
  date: string;
}

export interface GameScreenProps {
  onGameStart?: () => void;
}
