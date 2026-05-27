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

// ===== ゲーム画面用の新しい型定義 =====

// ブロックの種類（テトリスの7種類）
export enum BlockType {
  I = 'I',      // 水色：直線
  O = 'O',      // 黄色：正方形
  T = 'T',      // 紫：T字
  S = 'S',      // 緑：S字
  Z = 'Z',      // 赤：Z字
  J = 'J',      // 青：J字
  L = 'L',      // オレンジ：L字
  None = 'None' // ブロックなし
}

// ゲーム状態を管理
export interface GameState {
  score: number;              // 現在のスコア
  lines: number;              // 消したライン数
  level: number;              // レベル
  gameOver: boolean;          // ゲーム終了フラグ
  paused: boolean;            // ポーズフラグ
  nextBlock: BlockType;       // 次のブロック
  heldBlock: BlockType | null; // ホールドしているブロック
}

// グリッド上の1マスの情報
export interface GridCell {
  type: BlockType; // ブロックの種類
  filled: boolean; // 埋まっているかどうか
}

// グリッド全体（10×22）
export type Grid = GridCell[][];
