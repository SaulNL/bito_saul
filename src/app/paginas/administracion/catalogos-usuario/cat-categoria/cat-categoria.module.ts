import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CatCategoriaPageRoutingModule } from './cat-categoria-routing.module';

import { CatCategoriaPage } from './cat-categoria.page';
import {DatosCategoriaPage} from './datos-categoria/datos-categoria.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatCategoriaPageRoutingModule
  ],
  declarations: [CatCategoriaPage, DatosCategoriaPage]
})
export class CatCategoriaPageModule {}
