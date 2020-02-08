import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game.component';
import { FormsModule } from '@angular/forms';
import { PoModule } from '@portinari/portinari-ui';
import { SharedModule } from '../shared/module/shared/shared.module';

@NgModule({
  declarations: [GameComponent],
  imports: [
    CommonModule,
    GameRoutingModule,
    PoModule,
    FormsModule,
		SharedModule
  ]
})
export class GameModule { }
