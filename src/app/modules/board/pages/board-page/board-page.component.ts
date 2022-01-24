import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Square } from '@modules/board/models';
import { BoardPageStore } from './board-page.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-board-page',
  templateUrl: './board-page.component.html',
  styleUrls: ['./board-page.component.scss'],
  providers: [BoardPageStore],
})
export class BoardPageComponent implements OnInit {
  squares$ = this.store.squares$;
  isGameOver$ = this.store.isGameOver$;
  currentPlayer$ = this.store.currentPlayer$;
  winner$ = this.store.winner$;
  isTied$ = this.store.isTied$;

  constructor(protected store: BoardPageStore) {}

  ngOnInit(): void {
    this.store.generateSquares();
  }

  onSquare($event: Square) {
    this.store.playSquare($event);
  }

  onRestart() {
    this.store.restart();
  }
}
