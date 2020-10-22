import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CatPalabraReservadasPageRoutingModule } from './cat-palabra-reservadas-routing.module';

import { DatosPalabraReservadasPage } from './datos-palabra-reservadas/datos-palabra-reservadas.page';

import { CatPalabraReservadasPage } from './cat-palabra-reservadas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatPalabraReservadasPageRoutingModule
  ],
  declarations: [CatPalabraReservadasPage,
    DatosPalabraReservadasPage]
})
export class CatPalabraReservadasPageModule {}
