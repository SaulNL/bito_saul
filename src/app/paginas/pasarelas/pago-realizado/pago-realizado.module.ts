import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PagoRealizadoPageRoutingModule } from './pago-realizado-routing.module';

import { PagoRealizadoPage } from './pago-realizado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PagoRealizadoPageRoutingModule
  ],
  declarations: [PagoRealizadoPage]
})
export class PagoRealizadoPageModule {}
