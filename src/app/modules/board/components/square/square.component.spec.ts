import { Spectator, createComponentFactory, byTestId } from '@ngneat/spectator';
import { SquareComponent } from './square.component';

describe('SquareComponent', () => {
  let spectator: Spectator<SquareComponent>;
  const createComponent = createComponentFactory(SquareComponent);

  it('renders square player', () => {
    spectator = createComponent({
      props: { square: { position: [0, 0], value: '' } },
    });

    expect(spectator.query(byTestId('player'))).toBeEmpty();

    spectator.setInput({ square: { position: [0, 0], value: 'O' } });

    expect(spectator.query(byTestId('player'))).toHaveExactText('O');
  });

  it('renders square top css class', () => {
    spectator = createComponent({
      props: { square: { position: [0, 0], value: '' }, top: true },
    });

    expect(spectator.query(byTestId('square'))).toHaveClass('c-square--top');
  });

  it('renders square bottom css class', () => {
    spectator = createComponent({
      props: { square: { position: [2, 0], value: '' }, bottom: true },
    });

    expect(spectator.query(byTestId('square'))).toHaveClass('c-square--bottom');
  });

  it('renders square left css class', () => {
    spectator = createComponent({
      props: { square: { position: [0, 0], value: '' }, left: true },
    });

    expect(spectator.query(byTestId('square'))).toHaveClass('c-square--left');
  });

  it('renders square right css class', () => {
    spectator = createComponent({
      props: { square: { position: [0, 2], value: '' }, right: true },
    });

    expect(spectator.query(byTestId('square'))).toHaveClass('c-square--right');
  });
});
