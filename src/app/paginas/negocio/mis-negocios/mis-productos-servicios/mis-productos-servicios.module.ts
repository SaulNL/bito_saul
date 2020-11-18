import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTagsComponent } from '../../../../components/input-tags/input-tags.component';
import { IonicModule } from '@ionic/angular';
import { MisProductosServiciosPageRoutingModule } from './mis-productos-servicios-routing.module';
import { MisProductosServiciosPage } from './mis-productos-servicios.page';
import { ModalClasificacionComponent } from '../../../../componentes/modal-clasificacion/modal-clasificacion.component';
import { RecorteImagenComponent } from '../../../../components/recorte-imagen/recorte-imagen.component';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisProductosServiciosPageRoutingModule,
    ImageCropperModule 
  ],
  declarations: [
    MisProductosServiciosPage,
    InputTagsComponent,
    ModalClasificacionComponent,
    RecorteImagenComponent
  ]
})
export class MisProductosServiciosPageModule {}
