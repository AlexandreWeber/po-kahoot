import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { PoModule } from '@portinari/portinari-ui';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/module/shared/shared.module';


@NgModule({
  declarations: [AdminComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    PoModule, 
		FormsModule,
		SharedModule
  ]
})
export class AdminModule { }
