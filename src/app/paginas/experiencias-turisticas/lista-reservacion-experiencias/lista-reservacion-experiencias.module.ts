import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaReservacionExperienciasPageRoutingModule } from './lista-reservacion-experiencias-routing.module';

import { ListaReservacionExperienciasPage } from './lista-reservacion-experiencias.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaReservacionExperienciasPageRoutingModule
  ],
  declarations: [ListaReservacionExperienciasPage]
})
export class ListaReservacionExperienciasPageModule {}
