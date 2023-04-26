import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisSugerenciasPageRoutingModule } from './mis-sugerencias-routing.module';

import { MisSugerenciasPage } from './mis-sugerencias.page';
import {DarLikeNegocioModule} from '../../componentes/dar-like-negocio/dar-like-negocio.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisSugerenciasPageRoutingModule,
    DarLikeNegocioModule
  ],
  declarations: [MisSugerenciasPage]
})
export class MisSugerenciasModule {}
