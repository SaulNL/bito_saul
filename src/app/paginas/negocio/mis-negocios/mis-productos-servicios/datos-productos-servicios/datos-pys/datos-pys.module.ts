import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosPysPageRoutingModule } from './datos-pys-routing.module';

import { DatosPysPage } from './datos-pys.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosPysPageRoutingModule
  ],
  declarations: [DatosPysPage]
})
export class DatosPysPageModule {}
