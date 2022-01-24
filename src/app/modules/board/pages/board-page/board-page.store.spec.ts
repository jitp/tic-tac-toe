import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { cold } from 'jasmine-marbles';
import { fakeBoardMatrix } from 'src/tests/mocks/board-matrix.mock';
import { GameService } from '@app/services';
import { Square } from '@modules/board/models';
import { BoardPageStore } from './board-page.store';

describe('BoardPageStore', () => {
  let spectator: SpectatorService<BoardPageStore>;
  const createService = createServiceFactory({
    service: BoardPageStore,
    mocks: [GameService],
  });

  it('generates squares', () => {
    const matrix: Square[][] = fakeBoardMatrix(3);

    spectator = createService();

    const gameService = spectator.inject(GameService);
    gameService.generateBoardMatrix.and.returnValue(matrix);

    spectator.service.generateSquares();

    expect(spectator.service.squares$).toBeObservable(cold('x', { x: matrix }));
    expect(gameService.generateBoardMatrix).toHaveBeenCalledOnceWith(3);
  });

  it('plays the square and there is no winner', () => {
    const matrix: Square[][] = fakeBoardMatrix(3);
    const markedSquareMatrix: Square[][] = fakeBoardMatrix(3);
    markedSquareMatrix[1][1].value = 'X';

    spectator = createService();

    const gameService = spectator.inject(GameService);
    gameService.generateBoardMatrix.and.returnValue(matrix);
    gameService.hasExhausted.and.returnValue(false);
    gameService.markSquare.and.returnValue(markedSquareMatrix);
    gameService.resolveWinnerForPlay.and.returnValue('');

    spectator.service.playSquare(matrix[1][1]);

    expect(spectator.service.squares$).toBeObservable(
      cold('x', { x: markedSquareMatrix })
    );

    expect(spectator.service.winner$).toBeObservable(cold('x', { x: '' }));

    expect(spectator.service.currentPlayer$).toBeObservable(
      cold('x', { x: 'O' })
    );

    expect(spectator.service.select(({ turn }) => turn)).toBeObservable(
      cold('x', { x: 1 })
    );
  });

  it('plays the square and there is a winner', () => {
    const matrix: Square[][] = fakeBoardMatrix(3);
    const markedSquareMatrix: Square[][] = fakeBoardMatrix(3);
    markedSquareMatrix[1][1].value = 'X';

    spectator = createService();

    const gameService = spectator.inject(GameService);
    gameService.generateBoardMatrix.and.returnValue(matrix);
    gameService.hasExhausted.and.returnValue(false);
    gameService.markSquare.and.returnValue(markedSquareMatrix);
    gameService.resolveWinnerForPlay.and.returnValue('X');

    spectator.service.playSquare(matrix[1][1]);

    expect(spectator.service.squares$).toBeObservable(
      cold('x', { x: markedSquareMatrix })
    );

    expect(spectator.service.winner$).toBeObservable(cold('x', { x: 'X' }));

    expect(spectator.service.currentPlayer$).toBeObservable(
      cold('x', { x: 'O' })
    );

    expect(spectator.service.select(({ turn }) => turn)).toBeObservable(
      cold('x', { x: 1 })
    );
  });

  it('does not play the square when game is over', () => {
    const matrix: Square[][] = fakeBoardMatrix(3);

    spectator = createService();

    const gameService = spectator.inject(GameService);
    gameService.generateBoardMatrix.and.returnValue(matrix);
    gameService.hasExhausted.and.returnValue(true);

    spectator.service.generateSquares();
    spectator.service.playSquare(matrix[1][1]);

    expect(spectator.service.squares$).toBeObservable(cold('x', { x: matrix }));
    expect(spectator.service.currentPlayer$).toBeObservable(
      cold('x', { x: 'X' })
    );
    expect(spectator.service.select(({ turn }) => turn)).toBeObservable(
      cold('x', { x: 0 })
    );
  });

  it('checks play for winner', () => {
    const matrix: Square[][] = fakeBoardMatrix(3);

    spectator = createService();

    const gameService = spectator.inject(GameService);
    gameService.hasExhausted.and.returnValue(false);
    gameService.resolveWinnerForPlay.and.returnValue('O');

    spectator.service.checkPlayForWinner(matrix[1][1]);

    expect(spectator.service.winner$).toBeObservable(cold('x', { x: 'O' }));
  });

  it('does not check play for winner when game is over', () => {
    const matrix: Square[][] = fakeBoardMatrix(3);

    spectator = createService();

    const gameService = spectator.inject(GameService);
    gameService.generateBoardMatrix.and.returnValue(matrix);
    gameService.hasExhausted.and.returnValue(true);

    spectator.service.generateSquares();
    spectator.service.checkPlayForWinner(matrix[1][1]);

    expect(spectator.service.winner$).toBeObservable(cold('x', { x: '' }));
  });

  it('restarts', () => {
    const matrix: Square[][] = fakeBoardMatrix(3);
    spectator = createService();

    const gameService = spectator.inject(GameService);
    gameService.generateBoardMatrix.and.returnValue(matrix);

    spectator.service.restart();

    expect(spectator.service.state$).toBeObservable(
      cold('x', {
        x: {
          squares: matrix,
          currentPlayer: 'X',
          turn: 0,
          winner: '',
        },
      })
    );
  });
});
