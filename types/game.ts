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

// ===== ブロックの形状を定義 =====
// 各ブロックは4×4のグリッドで表現（テトリスの標準形）
// 1は埋まっている部分、0は空き部分
export const BLOCK_SHAPES: Record<BlockType, number[][]> = {
  // I型：水色の直線ブロック
  [BlockType.I]: [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
  ],
  // O型：黄色の正方形ブロック
  [BlockType.O]: [
    [1, 1, 0, 0],
    [1, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  // T型：紫のT字ブロック
  [BlockType.T]: [
    [1, 1, 1, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  // S型：緑のS字ブロック
  [BlockType.S]: [
    [0, 1, 1, 0],
    [1, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  // Z型：赤のZ字ブロック
  [BlockType.Z]: [
    [1, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  // J型：青のJ字ブロック
  [BlockType.J]: [
    [1, 0, 0, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  // L型：オレンジのL字ブロック
  [BlockType.L]: [
    [0, 0, 1, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  // None型：ブロックなし
  [BlockType.None]: [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
};

// ===== 現在落下中のブロック情報 =====
export interface CurrentBlock {
  type: BlockType;      // ブロックの種類
  row: number;         // 現在の行位置（グリッド上）
  column: number;      // 現在の列位置（グリッド上）
  rotation: number;    // 回転状態（0-3）
}
