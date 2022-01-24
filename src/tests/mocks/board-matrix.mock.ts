import { Square } from '@modules/board/models';

export const fakeBoardMatrix = (size: number = 3): Square[][] => {
  let matrix: Square[][] = [];
  for (let i = 0; i < size; i++) {
    let row: Square[] = [];
    for (let j = 0; j < size; j++) {
      row = [...row, { position: [i, j], value: '' } as Square];
    }

    matrix = [...matrix, row];
  }

  return matrix;
};
