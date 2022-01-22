import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BoardPageStore } from './board-page.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-board-page',
  templateUrl: './board-page.component.html',
  styleUrls: ['./board-page.component.scss'],
  providers: [BoardPageStore],
})
export class BoardPageComponent implements OnInit {
  constructor(protected store: BoardPageStore) {}

  ngOnInit(): void {}
}
