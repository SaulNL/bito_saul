import {IonicModule, LoadingController} from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InicioPage } from './inicio.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { Tab3PageRoutingModule } from './inicio-routing.module'
import {ToolbarBusquedaComponent} from "../../componentes/toolbar-busqueda/toolbar-busqueda.component";
import {FiltrosBusquedaModule} from "../../componentes/filtros-busqueda/filtros-busqueda.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: InicioPage }]),
    Tab3PageRoutingModule,
      FiltrosBusquedaModule
  ],
    declarations: [InicioPage, ToolbarBusquedaComponent]
})
export class Tab3PageModule {}
