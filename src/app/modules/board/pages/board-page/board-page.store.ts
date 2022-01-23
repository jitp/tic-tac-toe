import { Inject, Injectable } from '@angular/core';
import { AppConfig } from '@app/interfaces';
import { GameService } from '@app/services';
import { APP_CONFIG } from '@app/tokens';
import { IBoardPageState } from '@modules/board/interfaces';
import { Square } from '@modules/board/models';
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';
import { tap, withLatestFrom } from 'rxjs/operators';

const defaultState = (config: AppConfig): IBoardPageState => ({
  squares: [],
  currentPlayer: config.startingPlayer,
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
      console.log(state.currentPlayer !== p);
      return state.currentPlayer !== p;
    })!,
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
      tap({
        next: (square) => {
          this.markSquare(square);
          this.changeCurrentPlayer();
        },
      })
    );
  });
}
