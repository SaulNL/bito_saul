import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosCatDenunciaPageRoutingModule } from './datos-cat-denuncia-routing.module';

import { DatosCatDenunciaPage } from './datos-cat-denuncia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosCatDenunciaPageRoutingModule
  ],
  declarations: [DatosCatDenunciaPage]
})
export class DatosCatDenunciaPageModule {}
