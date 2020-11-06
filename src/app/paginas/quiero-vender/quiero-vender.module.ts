import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuieroVenderPageRoutingModule } from './quiero-vender-routing.module';

import { QuieroVenderPage } from './quiero-vender.page';

import { ImageCropperModule } from 'ngx-image-cropper';

import { RecorteImagenComponent } from '../../components/recorte-imagen/recorte-imagen.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuieroVenderPageRoutingModule,
    ReactiveFormsModule,
    ImageCropperModule
  ],
  declarations: [QuieroVenderPage,
    RecorteImagenComponent
  ]
})
export class QuieroVenderPageModule {}
