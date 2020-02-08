import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnswerComponent } from '../../components/answer/answer.component';



@NgModule({
  declarations: [
		AnswerComponent
	],
  imports: [
    CommonModule
  ],
	exports: [
		AnswerComponent
	]
})
export class SharedModule { }
