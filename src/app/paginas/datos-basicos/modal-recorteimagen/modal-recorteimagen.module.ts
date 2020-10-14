import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalRecorteimagenPageRoutingModule } from './modal-recorteimagen-routing.module';

import { ModalRecorteimagenPage } from './modal-recorteimagen.page';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalRecorteimagenPageRoutingModule,
    ImageCropperModule
  ],
  declarations: [ModalRecorteimagenPage]
})
export class ModalRecorteimagenPageModule {}
