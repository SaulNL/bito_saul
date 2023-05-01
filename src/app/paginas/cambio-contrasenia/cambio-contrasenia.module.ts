import { SpinnerModule } from './../../componentes/spinner/spinner.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CambioContraseniaPageRoutingModule } from './cambio-contrasenia-routing.module';

import { CambioContraseniaPage } from './cambio-contrasenia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CambioContraseniaPageRoutingModule,
    ReactiveFormsModule,
    SpinnerModule
  ],
  declarations: [CambioContraseniaPage]
})
export class CambioContraseniaPageModule {}
