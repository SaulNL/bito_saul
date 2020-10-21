import { DatosSubcategoriaPage } from './../cat-subcategoria/datos-subcategoria/datos-subcategoria.page';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CatCategoriaPageRoutingModule } from './cat-categoria-routing.module';

import { CatCategoriaPage } from './cat-categoria.page';
import {DatosCategoriaPage} from './datos-categoria/datos-categoria.page';
import {CatSubcategoriaPage} from './../cat-subcategoria/cat-subcategoria.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatCategoriaPageRoutingModule
  ],
  declarations: [CatCategoriaPage, DatosCategoriaPage, CatSubcategoriaPage, DatosSubcategoriaPage ]
})
export class CatCategoriaPageModule {}
