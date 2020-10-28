import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CatAvisoinformacionPageRoutingModule } from './cat-avisoinformacion-routing.module';

import { CatAvisoinformacionPage } from './cat-avisoinformacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatAvisoinformacionPageRoutingModule
  ],
  declarations: [CatAvisoinformacionPage]
})
export class CatAvisoinformacionPageModule {}
