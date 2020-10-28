import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalRecorteimagenPageRoutingModule } from './modal-recorteimagen-routing.module';

import { ModalRecorteimagenPage } from './modal-recorteimagen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalRecorteimagenPageRoutingModule,
  ],
  declarations: [ModalRecorteimagenPage]
})
export class ModalRecorteimagenPageModule {}
