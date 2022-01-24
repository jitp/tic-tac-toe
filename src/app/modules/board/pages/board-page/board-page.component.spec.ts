import { BoardComponent } from '@modules/board/components';
import { MockComponent } from 'ng-mocks';
import { cold, getTestScheduler } from 'jasmine-marbles';
import {
  Spectator,
  createComponentFactory,
  mockProvider,
  byTestId,
} from '@ngneat/spectator';
import { BoardPageComponent } from './board-page.component';
import { BoardPageStore } from './board-page.store';
import { fakeBoardMatrix } from 'src/tests/mocks/board-matrix.mock';
import { Square } from '@modules/board/models';

describe('BoardPageComponent', () => {
  let spectator: Spectator<BoardPageComponent>;
  const createComponent = createComponentFactory({
    component: BoardPageComponent,
    componentProviders: [BoardPageStore],
    declarations: [MockComponent(BoardComponent)],
  });

  it('generates squares on init', () => {
    spectator = createComponent({
      providers: [
        mockProvider(BoardPageStore, {
          generateSquares: jasmine.createSpy('generateSquares'),
        }),
      ],
    });

    const store = spectator.inject(BoardPageStore, true);

    expect(store.generateSquares).toHaveBeenCalledTimes(1);
  });

  it('pushes squares to board component', () => {
    const matrix = fakeBoardMatrix(3);

    spectator = createComponent({
      providers: [
        mockProvider(BoardPageStore, {
          squares$: cold('-x', { x: matrix }),
          generateSquares: jasmine.createSpy('generateSquares'),
        }),
      ],
    });

    getTestScheduler().flush();
    spectator.detectChanges();

    expect(spectator.query(BoardComponent)?.squares).toEqual(matrix);
  });

  it('plays square when board emits square event', () => {
    const square: Square = { position: [0, 0], value: '' };

    spectator = createComponent({
      providers: [
        mockProvider(BoardPageStore, {
          generateSquares: jasmine.createSpy('generateSquares'),
          playSquare: jasmine.createSpy('playSquare'),
        }),
      ],
    });

    const store = spectator.inject(BoardPageStore, true);

    spectator.query(BoardComponent)?.square.emit(square);
    spectator.detectChanges();

    expect(store.playSquare).toHaveBeenCalledOnceWith(square);
  });

  it('renders restart button when game is over', () => {
    spectator = createComponent({
      providers: [
        mockProvider(BoardPageStore, {
          isGameOver$: cold('-x', { x: true }),
          generateSquares: jasmine.createSpy('generateSquares'),
        }),
      ],
    });

    expect(spectator.query(byTestId('restartBtn'))).toBeFalsy();

    getTestScheduler().flush();
    spectator.detectChanges();

    expect(spectator.query(byTestId('restartBtn'))).toBeTruthy();
  });

  it('restarts game when clicking restart button', () => {
    spectator = createComponent({
      providers: [
        mockProvider(BoardPageStore, {
          isGameOver$: cold('-x', { x: true }),
          generateSquares: jasmine.createSpy('generateSquares'),
          restart: jasmine.createSpy('restart'),
        }),
      ],
    });

    getTestScheduler().flush();
    spectator.detectChanges();

    spectator.click(byTestId('restartBtn'));

    const store = spectator.inject(BoardPageStore, true);
    expect(store.restart).toHaveBeenCalledTimes(1);
  });

  it('shows turn for player message', () => {
    spectator = createComponent({
      providers: [
        mockProvider(BoardPageStore, {
          currentPlayer$: cold('-x', { x: 'X' }),
          isGameOver$: cold('-x', { x: false }),
          generateSquares: jasmine.createSpy('generateSquares'),
        }),
      ],
    });

    getTestScheduler().flush();
    spectator.detectChanges();

    expect(spectator.query(byTestId('playerTurnMsg'))).toHaveText(
      'Turn for player: X'
    );
  });

  it('shows winner message', () => {
    spectator = createComponent({
      providers: [
        mockProvider(BoardPageStore, {
          winner$: cold('-x', { x: 'X' }),
          generateSquares: jasmine.createSpy('generateSquares'),
        }),
      ],
    });

    getTestScheduler().flush();
    spectator.detectChanges();

    expect(spectator.query(byTestId('winnerMsg'))).toHaveText('Winner is X');
  });

  it('shows tie message', () => {
    spectator = createComponent({
      providers: [
        mockProvider(BoardPageStore, {
          isTied$: cold('-x', { x: true }),
          generateSquares: jasmine.createSpy('generateSquares'),
        }),
      ],
    });

    getTestScheduler().flush();
    spectator.detectChanges();

    expect(spectator.query(byTestId('tieMsg'))).toHaveText('It is a tie!');
  });
});
