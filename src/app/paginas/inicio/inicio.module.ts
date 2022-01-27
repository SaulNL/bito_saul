import { SpinnerModule } from './../../componentes/spinner/spinner.module';
import { DarLikeNegocioModule } from './../../componentes/dar-like-negocio/dar-like-negocio.module';
import {IonicModule} from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InicioPage } from './inicio.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';
import { Tab3PageRoutingModule } from './inicio-routing.module'
import {FiltrosBusquedaModule} from "../../componentes/filtros-busqueda/filtros-busqueda.module";
import {TabsPageModule} from '../tabs/tabs.module';
import { MapaNegociosComponent } from '../../componentes/mapa-negocios/mapa-negocios.component';
import {InfinitoScrollModule} from '../../componentes/infinito-scroll/infinito-scroll.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    DarLikeNegocioModule,
    SpinnerModule,
    InfinitoScrollModule,
    RouterModule.forChild([{ path: '', component: InicioPage }]),
    Tab3PageRoutingModule,
      FiltrosBusquedaModule,
      TabsPageModule
  ],
    declarations: [InicioPage, MapaNegociosComponent]
})
export class Tab3PageModule {}
