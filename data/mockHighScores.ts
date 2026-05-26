import { HighScore } from '@/types/game';

// 初期データ：ベスト3のハイスコア
export const mockHighScores: HighScore[] = [
  {
    rank: 1,
    score: 250000,
    playerName: 'Alex',
    date: '2026-05-20',
  },
  {
    rank: 2,
    score: 180500,
    playerName: 'Jordan',
    date: '2026-05-18',
  },
  {
    rank: 3,
    score: 156300,
    playerName: 'Casey',
    date: '2026-05-15',
  },
];
