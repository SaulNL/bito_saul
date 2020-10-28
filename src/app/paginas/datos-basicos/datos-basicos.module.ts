import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosBasicosPageRoutingModule } from './datos-basicos-routing.module';

import { DatosBasicosPage } from './datos-basicos.page';

import { RecorteImagenComponent } from './../../components/recorte-imagen/recorte-imagen.component';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosBasicosPageRoutingModule,
    ImageCropperModule
  ],
  declarations: [DatosBasicosPage, RecorteImagenComponent]
})
export class DatosBasicosPageModule {}
