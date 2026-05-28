import { BlockType, CurrentBlock, BLOCK_SHAPES, Grid } from '@/types/game';

// ===== ランダムにブロックタイプを選ぶ関数 =====
// テトリスの7種類のブロックからランダムに1つ選ぶ
export const getRandomBlockType = (): BlockType => {
  const blockTypes = [
    BlockType.I,
    BlockType.O,
    BlockType.T,
    BlockType.S,
    BlockType.Z,
    BlockType.J,
    BlockType.L,
  ];
  // 0～6のランダムなインデックスを生成して、ブロックタイプを選ぶ
  const randomIndex = Math.floor(Math.random() * blockTypes.length);
  return blockTypes[randomIndex];
};

// ===== ブロック形状を取得する関数 =====
// ブロックタイプから4×4の形状配列を取得
export const getBlockShape = (blockType: BlockType): number[][] => {
  return BLOCK_SHAPES[blockType];
};

// ===== グリッドに新しいブロックを配置する関数 =====
// グリッドに落下中のブロックをマージして表示
export const mergeBlockWithGrid = (
  grid: any[][], // グリッド
  currentBlock: CurrentBlock | null // 現在落下中のブロック
): any[][] => {
  // ===== グリッドのコピーを作成（元のグリッドを変更しないため） =====
  const newGrid = grid.map((row) => [...row]);

  // ===== 落下中のブロックがなければグリッドをそのまま返す =====
  if (!currentBlock) {
    return newGrid;
  }

  // ===== ブロック形状を取得 =====
  const blockShape = getBlockShape(currentBlock.type);

  // ===== ブロック形状の4×4配列をループして、グリッドに配置 =====
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      // ブロック形状で1の位置にブロックを配置
      if (blockShape[row][col] === 1) {
        // グリッド上の実際の位置を計算
        const gridRow = currentBlock.row + row;
        const gridCol = currentBlock.column + col;

        // グリッドの境界内かチェック
        if (
          gridRow >= 0 &&
          gridRow < newGrid.length &&
          gridCol >= 0 &&
          gridCol < newGrid[0].length
        ) {
          // グリッドにブロックを配置
          newGrid[gridRow][gridCol] = {
            type: currentBlock.type,
            filled: true,
          };
        }
      }
    }
  }

  return newGrid;
};

// ===== ブロックが着地できるかチェックする関数 =====
// ブロックが下に移動できるかを判定
export const canMoveDown = (
  currentBlock: CurrentBlock,
  grid: Grid
): boolean => {
  // ===== ブロック形状を取得 =====
  const blockShape = getBlockShape(currentBlock.type);

  // ===== ブロック形状の4×4配列をループ =====
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      // ===== ブロック形状で1の位置をチェック =====
      if (blockShape[row][col] === 1) {
        // グリッド上の実際の位置（1行下を確認） =====
        const gridRow = currentBlock.row + row + 1; // +1は下への移動をチェック
        const gridCol = currentBlock.column + col;

        // ===== グリッドの下限に到達したかチェック =====
        if (gridRow >= grid.length) {
          // グリッドの最下部に到達 → 着地
          return false;
        }

        // ===== グリッドの既に埋まっている位置に衝突したかチェック =====
        if (grid[gridRow][gridCol].filled) {
          // 他のブロックに衝突 → 着地
          return false;
        }
      }
    }
  }

  // ===== 下に移動できる状態 =====
  return true;
};

// ===== ブロックを1行下に移動させる関数 =====
// currentBlockの行位置を1増やす
export const moveBlockDown = (currentBlock: CurrentBlock): CurrentBlock => {
  return {
    ...currentBlock,
    row: currentBlock.row + 1, // 1行下に移動
  };
};

// ===== ブロックをグリッドに固定する関数 =====
// 着地したブロックをグリッドに確定させる
export const fixBlockToGrid = (
  grid: Grid,
  currentBlock: CurrentBlock
): Grid => {
  // ===== グリッドのコピーを作成（元のグリッドを変更しないため） =====
  const newGrid = grid.map((row) => [...row]);

  // ===== ブロック形状を取得 =====
  const blockShape = getBlockShape(currentBlock.type);

  // ===== ブロック形状の4×4配列をループして、グリッドに確定 =====
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      // ===== ブロック形状で1の位置をグリッドに確定 =====
      if (blockShape[row][col] === 1) {
        const gridRow = currentBlock.row + row;
        const gridCol = currentBlock.column + col;

        // ===== グリッドの境界内かチェック =====
        if (
          gridRow >= 0 &&
          gridRow < newGrid.length &&
          gridCol >= 0 &&
          gridCol < newGrid[0].length
        ) {
          // ===== グリッドに確定：filled = true =====
          newGrid[gridRow][gridCol] = {
            type: currentBlock.type,
            filled: true,
          };
        }
      }
    }
  }

  return newGrid;
};

// ===== 新しいブロックを作成する関数 =====
// 着地後、次のブロックを生成
export const createNewBlock = (blockType: BlockType): CurrentBlock => {
  return {
    type: blockType,
    row: 0,                    // 上から開始
    column: Math.floor(10 / 2 - 1), // 中央に配置
    rotation: 0,               // 回転状態なし
  };
};

// ===== ゲームオーバー判定関数 =====
// グリッドの最上部（行0）に埋まっているブロックがあるかチェック
export const checkGameOver = (grid: Grid): boolean => {
  // ===== グリッドの最上部（行0）をチェック =====
  // 行0に埋まっているセルがあれば、ゲームオーバー
  for (let col = 0; col < grid[0].length; col++) {
    if (grid[0][col].filled) {
      return true; // ゲームオーバー
    }
  }
  return false; // ゲーム継続
};
