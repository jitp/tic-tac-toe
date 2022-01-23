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
    return turn > Math.pow(boardSize, 2);
  }

  resolveWinnerForPlay(square: Square, squares: Square[][]): string {
    let winner = '';
    let [row, col] = square.position;
    const boardSize = squares.length;

    //Check row
    let i = 0;
    while (i < boardSize && squares[row][i].value === square.value) {
      if (i === boardSize - 1) {
        winner = square.value;
      }
      i += 1;
    }

    //Check column
    let j = 0;
    while (j < boardSize && squares[j][col].value === square.value) {
      if (j === boardSize - 1) {
        winner = square.value;
      }
      j += 1;
    }

    //Check diagonal
    if (row === col) {
      let k = 0;
      while (k < boardSize && squares[k][k].value === square.value) {
        if (k === boardSize - 1) {
          winner = square.value;
        }
        k += 1;
      }
    }

    //Check anti diagonal
    if (row + col === boardSize - 1) {
      let v = 0;
      while (
        v < boardSize &&
        squares[v][boardSize - 1 - v].value === square.value
      ) {
        if (v === boardSize - 1) {
          winner = square.value;
        }
        v += 1;
      }
    }

    return winner;
  }
}
