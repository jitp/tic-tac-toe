import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { Square } from '@modules/board/models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss'],
})
export class SquareComponent {
  @Input()
  square: Square | undefined;

  @Input()
  top: boolean = false;

  @Input()
  bottom: boolean = false;

  @Input()
  left: boolean = false;

  @Input()
  right: boolean = false;
}
