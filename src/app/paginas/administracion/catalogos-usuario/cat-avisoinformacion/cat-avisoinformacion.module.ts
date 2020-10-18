import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CatAvisoinformacionPageRoutingModule } from './cat-avisoinformacion-routing.module';

import { CatAvisoinformacionPage } from './cat-avisoinformacion.page';
import { DatosAvisosInformacionPage } from './datos-avisos-informacion/datos-avisos-informacion.page';
import { DatosPopoverPage } from './datos-popover/datos-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatAvisoinformacionPageRoutingModule
  ],
  declarations: [
    CatAvisoinformacionPage,
    DatosAvisosInformacionPage,
    DatosPopoverPage
  ]
})
export class CatAvisoinformacionPageModule {}
