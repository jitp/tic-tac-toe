import { Spectator, createComponentFactory, byTestId } from '@ngneat/spectator';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let spectator: Spectator<HeaderComponent>;
  const createComponent = createComponentFactory(HeaderComponent);

  it('renders title', () => {
    spectator = createComponent();

    expect(spectator.query(byTestId('header-title'))).toHaveExactText(
      'Tic Tac Toe!'
    );
  });
});
