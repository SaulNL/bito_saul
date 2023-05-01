import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoriasPageRoutingModule } from './categorias-routing.module';

import { CategoriasPage } from './categorias.page';
import { TabsPageModule } from '../tabs/tabs.module';
import {InfinitoScrollModule} from '../../componentes/infinito-scroll/infinito-scroll.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoriasPageRoutingModule,
    TabsPageModule,
    InfinitoScrollModule
  ],
  declarations: [CategoriasPage]
})
export class CategoriasPageModule {}
