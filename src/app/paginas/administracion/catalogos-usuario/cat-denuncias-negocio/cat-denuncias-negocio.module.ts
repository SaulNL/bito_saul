import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CatDenunciasNegocioPageRoutingModule } from './cat-denuncias-negocio-routing.module';

import { DatosCatDenunciaPage } from './datos-cat-denuncia/datos-cat-denuncia.page';

import { CatDenunciasNegocioPage } from './cat-denuncias-negocio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatDenunciasNegocioPageRoutingModule
  ],
  declarations: [CatDenunciasNegocioPage,DatosCatDenunciaPage]
})
export class CatDenunciasNegocioPageModule {}
