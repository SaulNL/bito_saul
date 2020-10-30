import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SolicitudPostuladosPageRoutingModule } from './solicitud-postulados-routing.module';

import { SolicitudPostuladosPage } from './solicitud-postulados.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SolicitudPostuladosPageRoutingModule
  ],
  declarations: [SolicitudPostuladosPage]
})
export class SolicitudPostuladosPageModule {}