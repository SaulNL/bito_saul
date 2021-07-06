import { DarLikeProductoModule } from './../../componentes/dar-like-producto/dar-like-producto.module';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosPage } from './productos.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';
import { TabsPageModule } from '../tabs/tabs.module';

import { Tab1PageRoutingModule } from './productos-routing.module';
import { ModalProductoPageModule } from './modal-producto/modal-producto.module';

import { InfoProductosComponent } from '../../components/info-productos/info-productos.component';
import { ModalProductosComponent } from '../../components/modal-productos/modal-productos.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    TabsPageModule,
    ModalProductoPageModule,
    DarLikeProductoModule
  ],
  declarations: [ProductosPage,
    InfoProductosComponent,
    ModalProductosComponent
  ]
})
export class Tab1PageModule {}
