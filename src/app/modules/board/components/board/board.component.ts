import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Square } from '@modules/board/models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  @Input()
  squares: Square[][] = [];

  constructor() {}

  ngOnInit(): void {}

  isTopSquare(square: Square): boolean {
    return square.position[0] === 0;
  }

  isBottomSquare(square: Square): boolean {
    return square.position[0] === this.squares.length - 1;
  }

  isLeftSquare(square: Square): boolean {
    return square.position[1] === 0;
  }

  isRightSquare(square: Square): boolean {
    return square.position[1] === this.squares.length - 1;
  }
}
