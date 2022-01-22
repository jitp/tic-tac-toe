import { Inject, Injectable } from '@angular/core';
import { AppConfig } from '@app/interfaces';
import { APP_CONFIG } from '@app/tokens';
import { IBoardPageState } from '@modules/board/interfaces';
import { ComponentStore } from '@ngrx/component-store';

const defaultState = (): IBoardPageState => ({
  boardSize: -1,
});

@Injectable()
export class BoardPageStore extends ComponentStore<IBoardPageState> {
  boardSize$ = this.select(({ boardSize }) => boardSize);

  constructor(@Inject(APP_CONFIG) protected appConfig: AppConfig) {
    super({ ...defaultState(), boardSize: appConfig.boardSize });
  }
}
