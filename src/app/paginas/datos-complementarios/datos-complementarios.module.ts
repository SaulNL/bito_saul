import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosComplementariosPageRoutingModule } from './datos-complementarios-routing.module';

import { DatosComplementariosPage } from './datos-complementarios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosComplementariosPageRoutingModule
  ],
  declarations: [DatosComplementariosPage]
})
export class DatosComplementariosPageModule {}
