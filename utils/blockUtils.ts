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
  grid: any[][],
  currentBlock: CurrentBlock | null
): any[][] => {
  // ===== グリッドのコピーを作成 =====
  const newGrid = grid.map((row) => [...row]);

  // ===== 落下中のブロックがなければグリッドをそのまま返す =====
  if (!currentBlock) {
    return newGrid;
  }

  // ===== 回転状態に応じたブロック形状を取得（修正） =====
  // getBlockShape ではなく getRotatedBlockShape を使用
  const blockShape = getRotatedBlockShape(currentBlock.type, currentBlock.rotation);

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

// ===== ブロックが左に移動できるかチェックする関数 =====
// ブロックが左に1マス移動できるかを判定
export const canMoveLeft = (
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
        // グリッド上の実際の位置（左への移動をチェック）
        const gridRow = currentBlock.row + row;
        const gridCol = currentBlock.column + col - 1; // -1は左への移動

        // ===== グリッドの左限に到達したかチェック =====
        if (gridCol < 0) {
          // グリッドの左端に到達 → 移動不可
          return false;
        }

        // ===== グリッドの既に埋まっている位置に衝突したかチェック =====
        if (gridRow >= 0 && grid[gridRow][gridCol].filled) {
          // 他のブロックに衝突 → 移動不可
          return false;
        }
      }
    }
  }

  // ===== 左に移動できる状態 =====
  return true;
};

// ===== ブロックが右に移動できるかチェックする関数 =====
// ブロックが右に1マス移動できるかを判定
export const canMoveRight = (
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
        // グリッド上の実際の位置（右への移動をチェック）
        const gridRow = currentBlock.row + row;
        const gridCol = currentBlock.column + col + 1; // +1は右への移動

        // ===== グリッドの右限に到達したかチェック =====
        if (gridCol >= grid[0].length) {
          // グリッドの右端に到達（10マス） → 移動不可
          return false;
        }

        // ===== グリッドの既に埋まっている位置に衝突したかチェック =====
        if (gridRow >= 0 && grid[gridRow][gridCol].filled) {
          // 他のブロックに衝突 → 移動不可
          return false;
        }
      }
    }
  }

  // ===== 右に移動できる状態 =====
  return true;
};

// ===== ブロックを左に1マス移動させる関数 =====
export const moveBlockLeft = (currentBlock: CurrentBlock): CurrentBlock => {
  return {
    ...currentBlock,
    column: currentBlock.column - 1, // 列を1減らす（左移動）
  };
};

// ===== ブロックを右に1マス移動させる関数 =====
export const moveBlockRight = (currentBlock: CurrentBlock): CurrentBlock => {
  return {
    ...currentBlock,
    column: currentBlock.column + 1, // 列を1増やす（右移動）
  };
};

// ===== ブロックタイプごとの回転中心を定義 =====
// テトリスガイドラインに準拠
// 中心座標は4×4グリッド上の位置
const ROTATION_CENTERS: Record<BlockType, { x: number; y: number }> = {
  [BlockType.I]: { x: 1.5, y: 1.5 },  // I型：グリッドの中央
  [BlockType.O]: { x: 1.5, y: 1.5 },  // O型：グリッドの中央（回転しない）
  [BlockType.T]: { x: 1, y: 1 },      // T型：中心やや左上
  [BlockType.S]: { x: 1, y: 1 },      // S型：中心やや左上
  [BlockType.Z]: { x: 1, y: 1 },      // Z型：中心やや左上
  [BlockType.J]: { x: 1, y: 1 },      // J型：中心やや左上
  [BlockType.L]: { x: 1, y: 1 },      // L型：中心やや左上
  [BlockType.None]: { x: 1.5, y: 1.5 }, // None：グリッドの中央
};

// ===== 回転中心を基準に4×4配列を90度時計回転する関数 =====
const rotateMatrixClockwiseAroundCenter = (
  matrix: number[][],
  blockType: BlockType
): number[][] => {
  // ===== 新しい4×4配列を作成 =====
  const rotated: number[][] = Array(4)
    .fill(null)
    .map(() => Array(4).fill(0));

  // ===== 回転中心を取得 =====
  const center = ROTATION_CENTERS[blockType];

  // ===== 各セルを回転中心を基準に回転 =====
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      // ===== 回転中心からの相対座標を計算 =====
      const relY = row - center.y;
      const relX = col - center.x;

      // ===== 90度時計回転：(x, y) → (y, -x) =====
      const newRelX = relY;
      const newRelY = -relX;

      // ===== 回転中心に戻す =====
      const newRow = Math.round(newRelY + center.y);
      const newCol = Math.round(newRelX + center.x);

      // ===== 回転後の座標がグリッド内かチェック =====
      if (newRow >= 0 && newRow < 4 && newCol >= 0 && newCol < 4) {
        rotated[newRow][newCol] = matrix[row][col];
      }
    }
  }

  return rotated;
};

// ===== 回転状態に応じたブロック形状を取得 =====
// rotationの値（0-3）に応じて、形状を回転させる
export const getRotatedBlockShape = (
  blockType: BlockType,
  rotation: number
): number[][] => {
  // ===== 基本形状を取得 =====
  let shape = getBlockShape(blockType);

  // ===== rotation回数分、90度回転を繰り返す =====
  for (let i = 0; i < rotation; i++) {
    shape = rotateMatrixClockwiseAroundCenter(shape, blockType);
  }

  return shape;
};

// ===== ブロックが回転できるかチェック =====
export const canRotate = (
  currentBlock: CurrentBlock,
  grid: Grid
): boolean => {
  // ===== 新しい回転状態を計算 =====
  const newRotation = (currentBlock.rotation + 1) % 4;

  // ===== 新しい回転状態でのブロック形状を取得 =====
  const rotatedShape = getRotatedBlockShape(
    currentBlock.type,
    newRotation
  );

  // ===== 回転後の形状でグリッド内に収まるかチェック =====
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      // ===== 形状で1の位置をチェック =====
      if (rotatedShape[row][col] === 1) {
        const gridRow = currentBlock.row + row;
        const gridCol = currentBlock.column + col;

        // ===== グリッドの範囲外をチェック =====
        if (gridRow < 0 || gridRow >= grid.length) {
          return false;
        }
        if (gridCol < 0 || gridCol >= grid[0].length) {
          return false;
        }

        // ===== グリッドに埋まっているセルをチェック =====
        if (gridRow >= 0 && grid[gridRow][gridCol].filled) {
          return false;
        }
      }
    }
  }

  // ===== 回転可能 =====
  return true;
};

// ===== ブロックを時計回転させる関数 =====
export const rotateBlockClockwise = (
  currentBlock: CurrentBlock
): CurrentBlock => {
  return {
    ...currentBlock,
    rotation: (currentBlock.rotation + 1) % 4, // 0→1→2→3→0
  };
};

// ===== ブロックを反時計回転させる関数 =====
export const rotateBlockCounterClockwise = (
  currentBlock: CurrentBlock
): CurrentBlock => {
  return {
    ...currentBlock,
    rotation: (currentBlock.rotation + 3) % 4, // 0→3→2→1→0（-1と同じ）
  };
};
