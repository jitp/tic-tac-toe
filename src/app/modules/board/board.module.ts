import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { BoardRoutingModule } from './board-routing.module';
import { BoardComponent } from './components';
import { BoardPageComponent } from './pages';

@NgModule({
  declarations: [BoardPageComponent, BoardComponent],
  imports: [SharedModule, BoardRoutingModule],
})
export class BoardModule {}
