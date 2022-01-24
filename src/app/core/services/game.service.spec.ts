import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Square } from '@modules/board/models';
import { fakeBoardMatrix } from 'src/tests/mocks/board-matrix.mock';
import { GameService } from '.';

describe('GameService', () => {
  let spectator: SpectatorService<GameService>;
  const createService = createServiceFactory(GameService);

  it('generates board matrix', () => {
    spectator = createService();
    let expectedMatrix: Square[][] = fakeBoardMatrix(2);

    expect(spectator.service.generateBoardMatrix(2)).toEqual(expectedMatrix);

    expectedMatrix = fakeBoardMatrix(3);
    expect(spectator.service.generateBoardMatrix(3)).toEqual(expectedMatrix);
  });

  it('marks a square with the player', () => {
    spectator = createService();
    let matrix: Square[][] = fakeBoardMatrix(3);
    let square: Square = matrix[1][1];

    const expectedMatrix: Square[][] = [...matrix];
    expectedMatrix[1][1].value = 'X';

    expect(spectator.service.markSquare(matrix, square, 'X')).toEqual(
      expectedMatrix
    );
  });

  it('checks has exhausted all turns', () => {
    spectator = createService();
    let matrix: Square[][] = fakeBoardMatrix(3);

    expect(spectator.service.hasExhausted(1, matrix.length)).toBeFalse();
    expect(spectator.service.hasExhausted(9, matrix.length)).toBeTrue();
  });

  describe('resolveWinnerForPlay', () => {
    it('resolves winner in a row', () => {
      let matrix: Square[][] = fakeBoardMatrix(3);
      spectator = createService();

      for (let square of matrix[0]) {
        square.value = 'X';
      }

      matrix[1][1].value = 'O';
      matrix[2][0].value = 'X';

      expect(
        spectator.service.resolveWinnerForPlay(matrix[0][1], matrix)
      ).toEqual('X');
      expect(
        spectator.service.resolveWinnerForPlay(matrix[1][0], matrix)
      ).toEqual('');
      expect(
        spectator.service.resolveWinnerForPlay(matrix[2][2], matrix)
      ).toEqual('');
    });

    it('resolves winner in a column', () => {
      let matrix: Square[][] = fakeBoardMatrix(3);
      spectator = createService();

      matrix[0][0].value = 'X';
      matrix[1][0].value = 'X';
      matrix[2][0].value = 'X';

      matrix[1][1].value = 'O';
      matrix[2][2].value = 'X';

      expect(
        spectator.service.resolveWinnerForPlay(matrix[1][0], matrix)
      ).toEqual('X');
      expect(
        spectator.service.resolveWinnerForPlay(matrix[0][1], matrix)
      ).toEqual('');
      expect(
        spectator.service.resolveWinnerForPlay(matrix[2][2], matrix)
      ).toEqual('');
    });

    it('resolves winner in a diagonal', () => {
      let matrix: Square[][] = fakeBoardMatrix(3);
      spectator = createService();

      matrix[0][0].value = 'X';
      matrix[1][1].value = 'X';
      matrix[2][2].value = 'X';

      expect(
        spectator.service.resolveWinnerForPlay(matrix[1][1], matrix)
      ).toEqual('X');
    });

    it('resolves winner in anti diagonal', () => {
      let matrix: Square[][] = fakeBoardMatrix(3);
      spectator = createService();

      matrix[0][2].value = 'X';
      matrix[1][1].value = 'X';
      matrix[2][0].value = 'X';

      expect(
        spectator.service.resolveWinnerForPlay(matrix[1][1], matrix)
      ).toEqual('X');
    });
  });
});
