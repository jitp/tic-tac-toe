import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { BoardPageComponent } from './pages/board-page/board-page.component';
import { BoardRoutingModule } from './board-routing.module';

@NgModule({
  declarations: [BoardPageComponent],
  imports: [SharedModule, BoardRoutingModule],
})
export class BoardModule {}
