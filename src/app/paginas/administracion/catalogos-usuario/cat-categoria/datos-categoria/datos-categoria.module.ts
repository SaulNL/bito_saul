import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosCategoriaPageRoutingModule } from './datos-categoria-routing.module';

import { DatosCategoriaPage } from './datos-categoria.page';
import { CatCategoriaPage } from '../cat-categoria.page';
import {CatSubcategoriaPage} from '../../cat-subcategoria/cat-subcategoria.page';
import { DatosSubcategoriaPage} from '../../cat-subcategoria/datos-subcategoria/datos-subcategoria.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosCategoriaPageRoutingModule
  ],
  declarations: [DatosCategoriaPage, CatCategoriaPage, CatSubcategoriaPage, DatosSubcategoriaPage]
})
export class DatosCategoriaPageModule {}
