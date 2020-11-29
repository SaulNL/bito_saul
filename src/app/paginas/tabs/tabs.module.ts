import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';
import { BannerPromocionesComponent } from '../../componentes/banner-promociones/banner-promociones.component';
import { ToolbarBusquedaComponent } from '../../componentes/toolbar-busqueda/toolbar-busqueda.component';
import { InputTagsComponent } from '../../components/input-tags/input-tags.component';
import { TabsPageRoutingModule } from './tabs-routing.module';
import { ModalClasificacionComponent } from '../../componentes/modal-clasificacion/modal-clasificacion.component';
import { RecorteImagenComponent } from '../../components/recorte-imagen/recorte-imagen.component';
import { ImageCropperModule } from 'ngx-image-cropper';

import { TabsPage } from './tabs.page';
import { BotonTopComponent } from 'src/app/componentes/boton-top/boton-top.component';
import {FiltrosBusquedaComponent} from "../../componentes/filtros-busqueda/filtros-busqueda.component";


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    ImageCropperModule
  ],
  declarations: [
    TabsPage,
    BannerPromocionesComponent,
    ToolbarBusquedaComponent,
    BotonTopComponent,
    InputTagsComponent,
    ModalClasificacionComponent,
    RecorteImagenComponent,
      FiltrosBusquedaComponent
  ],
  exports: [
    BannerPromocionesComponent,
    ToolbarBusquedaComponent ,
    BotonTopComponent,
    InputTagsComponent,
    ModalClasificacionComponent,
    RecorteImagenComponent,
    FiltrosBusquedaComponent
  ]
})
export class TabsPageModule {}
