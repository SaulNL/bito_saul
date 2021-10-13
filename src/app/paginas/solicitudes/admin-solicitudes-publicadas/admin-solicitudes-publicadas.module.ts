import { SpinnerModule } from './../../../componentes/spinner/spinner.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminSolicitudesPublicadasPageRoutingModule } from './admin-solicitudes-publicadas-routing.module';

import { AdminSolicitudesPublicadasPage } from './admin-solicitudes-publicadas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminSolicitudesPublicadasPageRoutingModule,
    SpinnerModule
  ],
  declarations: [AdminSolicitudesPublicadasPage]
})
export class AdminSolicitudesPublicadasPageModule {}
