import { DatosSubcategoriaPage } from './datos-subcategoria/datos-subcategoria.page';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CatSubcategoriaPageRoutingModule } from './cat-subcategoria-routing.module';

import { CatSubcategoriaPage } from './cat-subcategoria.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatSubcategoriaPageRoutingModule
  ],
  declarations: [CatSubcategoriaPage, DatosSubcategoriaPage ]
})
export class CatSubcategoriaPageModule {}
