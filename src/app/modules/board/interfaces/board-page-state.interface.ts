import { Square } from '../models';

export interface IBoardPageState {
  squares: Square[][];
  currentPlayer: string;
  turn: number;
}
