import { BlockType, CurrentBlock, BLOCK_SHAPES } from '@/types/game';

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
