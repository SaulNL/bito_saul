import { SpinnerModule } from './../../../componentes/spinner/spinner.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SolicitudCambioUrlPageRoutingModule } from './solicitud-cambio-url-routing.module';

import { SolicitudCambioUrlPage } from './solicitud-cambio-url.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SolicitudCambioUrlPageRoutingModule,
    SpinnerModule
  ],
  declarations: [SolicitudCambioUrlPage]
})
export class SolicitudCambioUrlPageModule {}
