import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FermularioExperienciasPageRoutingModule } from './fermulario-experiencias-routing.module';

import { FermularioExperienciasPage } from './fermulario-experiencias.page';
import { SpinnerModule } from 'src/app/componentes/spinner/spinner.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FermularioExperienciasPageRoutingModule,
    ReactiveFormsModule,
    SpinnerModule,
  ],
  declarations: [FermularioExperienciasPage]
})
export class FermularioExperienciasPageModule {}
