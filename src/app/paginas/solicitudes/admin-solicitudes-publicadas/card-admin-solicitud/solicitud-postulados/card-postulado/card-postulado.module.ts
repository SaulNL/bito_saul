import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CardPostuladoPageRoutingModule } from './card-postulado-routing.module';

import { CardPostuladoPage } from './card-postulado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CardPostuladoPageRoutingModule
  ],
  declarations: [CardPostuladoPage]
})
export class CardPostuladoPageModule {}
