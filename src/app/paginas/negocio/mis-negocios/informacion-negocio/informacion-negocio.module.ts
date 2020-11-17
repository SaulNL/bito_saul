import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InformacionNegocioPageRoutingModule } from './informacion-negocio-routing.module';

import { InformacionNegocioPage } from './informacion-negocio.page';

import { ImageCropperModule } from 'ngx-image-cropper';
import {RecorteImagenComponent} from "../../../../components/recorte-imagen/recorte-imagen.component";

import { InputTagsComponent } from '../../../../components/input-tags/input-tags.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InformacionNegocioPageRoutingModule,
    ImageCropperModule
  ],
  declarations: [InformacionNegocioPage, RecorteImagenComponent, InputTagsComponent]
})
export class InformacionNegocioPageModule {}
