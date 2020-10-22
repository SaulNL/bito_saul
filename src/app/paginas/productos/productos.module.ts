import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosPage } from './productos.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { Tab1PageRoutingModule } from './productos-routing.module';
import {ToolbarBusquedaComponent} from "../../componentes/toolbar-busqueda/toolbar-busqueda.component";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule
  ],
  declarations: [ProductosPage, ToolbarBusquedaComponent]
})
export class Tab1PageModule {}
