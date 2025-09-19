/**
 * Scales a 2D pattern matrix to a new height, maintaining aspect ratio.
 * @param matrix The original 7x5 pattern matrix.
 * @param newHeight The target height (e.g., 3, 5, or 7).
 * @returns A new, scaled 2D matrix.
 */
export const scalePattern = (matrix: number[][], newHeight: number): number[][] => {
  if (!matrix || matrix.length === 0) {
    return [];
  }

  const originalHeight = 7;
  const originalWidth = 5;

  // Clamp the new height to be between 3 and 7
  const clampedHeight = Math.max(3, Math.min(7, newHeight));

  if (clampedHeight === originalHeight) {
    return matrix; // Return original if no scaling is needed
  }

  const newWidth = Math.round(originalWidth * (clampedHeight / originalHeight));
  const scaledMatrix: number[][] = [];

  for (let r = 0; r < clampedHeight; r++) {
    const row: number[] = [];
    for (let c = 0; c < newWidth; c++) {
      // Find the corresponding pixel in the original matrix
      const originalRow = Math.floor(r * (originalHeight / clampedHeight));
      const originalCol = Math.floor(c * (originalWidth / newWidth));
      row.push(matrix[originalRow][originalCol]);
    }
    scaledMatrix.push(row);
  }

  return scaledMatrix;
};
