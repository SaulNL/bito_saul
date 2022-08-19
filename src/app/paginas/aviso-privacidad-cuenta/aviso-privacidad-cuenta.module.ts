import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AvisoPrivacidadCuentaPageRoutingModule } from './aviso-privacidad-cuenta-routing.module';

import { AvisoPrivacidadCuentaPage } from './aviso-privacidad-cuenta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AvisoPrivacidadCuentaPageRoutingModule
  ],
  declarations: [AvisoPrivacidadCuentaPage]
})
export class AvisoPrivacidadCuentaPageModule {}
