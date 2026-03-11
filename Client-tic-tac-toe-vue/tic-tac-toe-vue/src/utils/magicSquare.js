/**
 * Magic Square Configuration
 * In a 3x3 magic square, any line (row, column, or diagonal) sums to 15
 */
export const MAGIC_SQUARE = [
  [2, 7, 6],
  [9, 5, 1],
  [4, 3, 8]
];

/**
 * Get magic square value by position (0-8)
 */
export const getMagicValue = (position) => {
  const row = Math.floor(position / 3);
  const col = position % 3;
  return MAGIC_SQUARE[row][col];
};

/**
 * Get position from magic square value
 */
export const getPositionFromMagicValue = (magicValue) => {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (MAGIC_SQUARE[row][col] === magicValue) {
        return row * 3 + col;
      }
    }
  }
  return -1;
};
