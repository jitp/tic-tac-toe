import { Inject, Injectable } from '@angular/core';
import { AppConfig } from '@app/interfaces';
import { GameService } from '@app/services';
import { APP_CONFIG } from '@app/tokens';
import { IBoardPageState } from '@modules/board/interfaces';
import { Square } from '@modules/board/models';
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';
import { mapTo, tap } from 'rxjs/operators';

const defaultState = (): IBoardPageState => ({
  squares: [],
});

@Injectable()
export class BoardPageStore extends ComponentStore<IBoardPageState> {
  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    protected gameService: GameService
  ) {
    super(defaultState());
  }

  // SELECTORS
  squares$ = this.select(({ squares }) => squares);

  // UPDATERS

  setSquares = this.updater((state: IBoardPageState, squares: Square[][]) => ({
    ...state,
    squares,
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
}
