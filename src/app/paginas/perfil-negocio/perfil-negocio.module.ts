import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilNegocioPageRoutingModule } from './perfil-negocio-routing.module';

import { PerfilNegocioPage } from './perfil-negocio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilNegocioPageRoutingModule
  ],
  declarations: [PerfilNegocioPage]
})
export class PerfilNegocioPageModule {}
