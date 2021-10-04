import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActualizarVersionPageRoutingModule } from './actualizar-version-routing.module';

import { ActualizarVersionPage } from './actualizar-version.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActualizarVersionPageRoutingModule
  ],
  declarations: [ActualizarVersionPage]
})
export class ActualizarVersionPageModule {}
