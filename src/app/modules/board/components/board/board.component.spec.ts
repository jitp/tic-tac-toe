import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockComponent } from 'ng-mocks';
import { fakeBoardMatrix } from 'src/tests/mocks/board-matrix.mock';
import { Square } from '@modules/board/models';
import { SquareComponent } from '..';
import { BoardComponent } from './board.component';

describe('BoardComponent', () => {
  let spectator: Spectator<BoardComponent>;
  const createComponent = createComponentFactory({
    component: BoardComponent,
    declarations: [MockComponent(SquareComponent)],
  });

  it('renders board squares', () => {
    const matrix: Square[][] = fakeBoardMatrix(3);

    spectator = createComponent({ props: { squares: matrix } });

    const squareCmps = spectator.queryAll(SquareComponent);

    expect(squareCmps.length).toEqual(Math.pow(matrix.length, 2));

    let k = 0;
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        expect(squareCmps[k].square).toEqual(matrix[i][j]);
        expect(squareCmps[k].top).toEqual(
          spectator.component.isTopSquare(matrix[i][j])
        );
        expect(squareCmps[k].bottom).toEqual(
          spectator.component.isBottomSquare(matrix[i][j])
        );
        expect(squareCmps[k].left).toEqual(
          spectator.component.isLeftSquare(matrix[i][j])
        );
        expect(squareCmps[k].right).toEqual(
          spectator.component.isRightSquare(matrix[i][j])
        );
        k += 1;
      }
    }
  });

  it('tells square is a top square', () => {
    const matrix: Square[][] = fakeBoardMatrix(3);

    spectator = createComponent({ props: { squares: matrix } });

    expect(spectator.component.isTopSquare(matrix[0][0])).toBeTrue();
    expect(spectator.component.isTopSquare(matrix[1][0])).not.toBeTrue();
  });

  it('tells square is a bottom square', () => {
    const matrix: Square[][] = fakeBoardMatrix(3);

    spectator = createComponent({ props: { squares: matrix } });

    expect(spectator.component.isBottomSquare(matrix[2][0])).toBeTrue();
    expect(spectator.component.isBottomSquare(matrix[0][0])).not.toBeTrue();
  });

  it('tells square is a left square', () => {
    const matrix: Square[][] = fakeBoardMatrix(3);

    spectator = createComponent({ props: { squares: matrix } });

    expect(spectator.component.isLeftSquare(matrix[0][0])).toBeTrue();
    expect(spectator.component.isLeftSquare(matrix[2][2])).not.toBeTrue();
  });

  it('tells square is a right square', () => {
    const matrix: Square[][] = fakeBoardMatrix(3);

    spectator = createComponent({ props: { squares: matrix } });

    expect(spectator.component.isRightSquare(matrix[0][2])).toBeTrue();
    expect(spectator.component.isRightSquare(matrix[2][0])).not.toBeTrue();
  });

  it('tells square is not in the border', () => {
    const matrix: Square[][] = fakeBoardMatrix(3);

    spectator = createComponent({ props: { squares: matrix } });

    expect(spectator.component.isRightSquare(matrix[1][1])).not.toBeTrue();
    expect(spectator.component.isBottomSquare(matrix[1][1])).not.toBeTrue();
    expect(spectator.component.isLeftSquare(matrix[1][1])).not.toBeTrue();
    expect(spectator.component.isTopSquare(matrix[1][1])).not.toBeTrue();
  });

  it('outputs square event when clicking a square', () => {
    const matrix: Square[][] = fakeBoardMatrix(3);
    let emittedSquare: Square | undefined;

    spectator = createComponent({ props: { squares: matrix } });

    spectator.component.square.subscribe((s) => (emittedSquare = s));

    spectator.click(spectator.queryLast("app-square")!);

    expect(emittedSquare).toEqual(matrix[2][2]);
  });
});
