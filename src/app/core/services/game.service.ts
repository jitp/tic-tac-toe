import { Injectable } from '@angular/core';
import { Square } from '@modules/board/models';

@Injectable({ providedIn: 'root' })
export class GameService {
  generateBoardMatrix(size: number): Square[][] {
    let matrix: Square[][] = [];
    for (let i = 0; i < size; i++) {
      let row: Square[] = [];
      for (let j = 0; j < size; j++) {
        row = [...row, { position: [i, j], value: '' } as Square];
      }

      matrix = [...matrix, row];
    }

    return matrix;
  }

  markSquare(squares: Square[][], square: Square, player: string): Square[][] {
    square.value = player;

    return [...squares];
  }

  isGameOver(turn: number, boardSize: number): boolean {
    return turn >= Math.pow(boardSize, 2);
  }
}
