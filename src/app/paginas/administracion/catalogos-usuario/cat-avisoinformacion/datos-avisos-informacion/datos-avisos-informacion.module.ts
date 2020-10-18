import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosAvisosInformacionPageRoutingModule } from './datos-avisos-informacion-routing.module';

import { DatosAvisosInformacionPage } from './datos-avisos-informacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosAvisosInformacionPageRoutingModule
  ],
  declarations: [DatosAvisosInformacionPage]
})
export class DatosAvisosInformacionPageModule {}
