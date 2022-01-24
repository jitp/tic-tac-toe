import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { MockComponent } from 'ng-mocks';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout';

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;
  const createComponent = createComponentFactory({
    component: AppComponent,
    declarations: [MockComponent(HeaderComponent)],
    imports: [RouterTestingModule],
  });

  it('renders header component', () => {
    spectator = createComponent();

    expect(spectator.query(HeaderComponent)).toBeTruthy();
  });
});
