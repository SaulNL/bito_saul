import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosPalabraReservadasPageRoutingModule } from './datos-palabra-reservadas-routing.module';

import { DatosPalabraReservadasPage } from './datos-palabra-reservadas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosPalabraReservadasPageRoutingModule
  ],
  declarations: [DatosPalabraReservadasPage]
})
export class DatosPalabraReservadasPageModule {}
