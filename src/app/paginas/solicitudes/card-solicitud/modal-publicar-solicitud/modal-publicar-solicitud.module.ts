import { SpinnerModule } from './../../../../componentes/spinner/spinner.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalPublicarSolicitudPageRoutingModule } from './modal-publicar-solicitud-routing.module';

import { ModalPublicarSolicitudPage } from './modal-publicar-solicitud.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalPublicarSolicitudPageRoutingModule,
    SpinnerModule
  ],
  declarations: [ModalPublicarSolicitudPage]
})
export class ModalPublicarSolicitudPageModule {}
