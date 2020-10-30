import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormSolicitudPageRoutingModule } from './form-solicitud-routing.module';

import { FormSolicitudPage } from './form-solicitud.page';
import { InputTagsComponent } from '../../../components/input-tags/input-tags.component';

import { ImageCropperModule } from 'ngx-image-cropper';
import {RecorteImagenComponent} from "../../../components/recorte-imagen/recorte-imagen.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormSolicitudPageRoutingModule,
      ImageCropperModule
  ],
  declarations: [FormSolicitudPage, InputTagsComponent,  RecorteImagenComponent]
})
export class FormSolicitudPageModule {}