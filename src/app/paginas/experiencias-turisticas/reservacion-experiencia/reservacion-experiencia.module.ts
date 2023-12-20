import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservacionExperienciaPageRoutingModule } from './reservacion-experiencia-routing.module';

import { ReservacionExperienciaPage } from './reservacion-experiencia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReservacionExperienciaPageRoutingModule
  ],
  declarations: [ReservacionExperienciaPage]
})
export class ReservacionExperienciaPageModule {}
