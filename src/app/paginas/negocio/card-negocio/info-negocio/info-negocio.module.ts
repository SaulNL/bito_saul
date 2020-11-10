import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfoNegocioPageRoutingModule } from './info-negocio-routing.module';

import { InfoNegocioPage } from './info-negocio.page';
import { ImageCropperModule } from 'ngx-image-cropper';
import {RecorteImagenComponent} from "../../../../components/recorte-imagen/recorte-imagen.component";

import { InputTagsComponent } from '../../../../components/input-tags/input-tags.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfoNegocioPageRoutingModule,
    ImageCropperModule
  ],
  declarations: [InfoNegocioPage, RecorteImagenComponent, InputTagsComponent]
})
export class InfoNegocioPageModule {}
