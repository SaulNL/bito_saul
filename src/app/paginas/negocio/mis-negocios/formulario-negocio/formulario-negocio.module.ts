import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormularioNegocioPageRoutingModule } from './formulario-negocio-routing.module';

import { FormularioNegocioPage } from './formulario-negocio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormularioNegocioPageRoutingModule
  ],
  declarations: [FormularioNegocioPage]
})
export class FormularioNegocioPageModule {}
