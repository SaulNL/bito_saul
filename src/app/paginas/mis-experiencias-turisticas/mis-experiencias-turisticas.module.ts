import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisExperienciasTuristicasPageRoutingModule } from './mis-experiencias-turisticas-routing.module';

import { MisExperienciasTuristicasPage } from './mis-experiencias-turisticas.page';
import { SpinnerModule } from '../../componentes/spinner/spinner.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisExperienciasTuristicasPageRoutingModule,
    SpinnerModule
  ],
  declarations: [MisExperienciasTuristicasPage]
})
export class MisExperienciasTuristicasPageModule {}
