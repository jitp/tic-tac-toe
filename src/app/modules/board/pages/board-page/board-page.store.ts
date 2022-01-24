import { Inject, Injectable } from '@angular/core';
import { AppConfig } from '@app/interfaces';
import { GameService } from '@app/services';
import { APP_CONFIG } from '@app/tokens';
import { IBoardPageState } from '@modules/board/interfaces';
import { Square } from '@modules/board/models';
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';
import { filter, tap, withLatestFrom } from 'rxjs/operators';

const defaultState = (config: AppConfig): IBoardPageState => ({
  squares: [],
  currentPlayer: config.startingPlayer,
  turn: 0,
  winner: '',
});

@Injectable()
export class BoardPageStore extends ComponentStore<IBoardPageState> {
  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    protected gameService: GameService
  ) {
    super(defaultState(appConfig));
  }

  // SELECTORS
  squares$ = this.select(({ squares }) => squares);

  currentPlayer$ = this.select(({ currentPlayer }) => currentPlayer);

  noMoreTurns$ = this.select((state) =>
    this.gameService.hasExhausted(state.turn, state.squares.length)
  );

  winner$ = this.select(({ winner }) => winner);

  isGameOver$ = this.select(
    this.noMoreTurns$,
    this.winner$,
    (noMoreTurns, winner) => noMoreTurns || !!winner
  );

  isTied$ = this.select(
    this.noMoreTurns$,
    this.winner$,
    (noMoreTurns, winner) => noMoreTurns && !!winner === false
  );

  // UPDATERS

  setSquares = this.updater((state: IBoardPageState, squares: Square[][]) => ({
    ...state,
    squares,
  }));

  setCurrentPlayer = this.updater(
    (state: IBoardPageState, currentPlayer: string) => ({
      ...state,
      currentPlayer,
    })
  );

  setWinner = this.updater((state: IBoardPageState, winner: string) => ({
    ...state,
    winner,
  }));

  markSquare = this.updater((state: IBoardPageState, square: Square) => ({
    ...state,
    squares: this.gameService.markSquare(
      state.squares,
      square,
      state.currentPlayer
    ),
  }));

  changeCurrentPlayer = this.updater((state) => ({
    ...state,
    currentPlayer: this.appConfig.players.find((p) => {
      return state.currentPlayer !== p;
    })!,
  }));

  incrementTurn = this.updater((state) => ({
    ...state,
    turn: state.turn + 1,
  }));

  // EFFECTS

  generateSquares = this.effect((trigger$: Observable<void>) => {
    return trigger$.pipe(
      tap(() =>
        this.setSquares(
          this.gameService.generateBoardMatrix(this.appConfig.boardSize)
        )
      )
    );
  });

  playSquare = this.effect((trigger$: Observable<Square>) => {
    return trigger$.pipe(
      withLatestFrom(this.isGameOver$),
      filter(([, isGameOver]) => !isGameOver),
      tap({
        next: ([square, isGameStopped]) => {
          this.markSquare(square);
          this.checkPlayForWinner(square);
          this.changeCurrentPlayer();
          this.incrementTurn();
        },
      })
    );
  });

  checkPlayForWinner = this.effect((trigger$: Observable<Square>) => {
    return trigger$.pipe(
      withLatestFrom(this.squares$, this.isGameOver$),
      filter(([, , isGameOver]) => !isGameOver),
      tap(([square, squares, isGameOver]) => {
        let winner = this.gameService.resolveWinnerForPlay(square, squares);
        this.setWinner(winner);
      })
    );
  });

  restart = this.effect((trigger$: Observable<void>) => {
    return trigger$.pipe(
      tap(() => {
        this.setState(defaultState(this.appConfig));
        this.generateSquares();
      })
    );
  });
}
