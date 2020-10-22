import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SolicitudesPageRoutingModule } from './solicitudes-routing.module';

import { SolicitudesPage } from './solicitudes.page';

import {FormSolicitudPage } from './form-solicitud/form-solicitud.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SolicitudesPageRoutingModule  
  ],
  declarations: [SolicitudesPage, FormSolicitudPage ]
})
export class SolicitudesPageModule {}
