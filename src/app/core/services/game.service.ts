import { Injectable } from '@angular/core';
import { Square } from '@modules/board/models';

@Injectable({ providedIn: 'root' })
export class GameService {
  generateBoardMatrix(size: number): Square[][] {
    let matrix: Square[][] = [];
    for (let i = 0; i < size; i++) {
      let row: Square[] = [];
      for (let j = 0; j < size; j++) {
        row = [...row, {} as Square];
      }

      matrix = [...matrix, row];
    }

    return matrix;
  }
}
