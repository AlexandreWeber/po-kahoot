import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game.component';
import { FormsModule } from '@angular/forms';
import { PoModule } from '@portinari/portinari-ui';
import { AnswerComponent } from '../shared/components/answer/answer.component';


@NgModule({
  declarations: [GameComponent, AnswerComponent],
  imports: [
    CommonModule,
    GameRoutingModule,
    PoModule,
    FormsModule
  ]
})
export class GameModule { }
