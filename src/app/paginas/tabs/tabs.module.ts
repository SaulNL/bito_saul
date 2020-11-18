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
    InputTagsComponent,
    ModalClasificacionComponent,
    RecorteImagenComponent
  ],
  exports: [
    BannerPromocionesComponent,
    ToolbarBusquedaComponent,
    InputTagsComponent,
    ModalClasificacionComponent,
    RecorteImagenComponent
  ]
})
export class TabsPageModule {}
