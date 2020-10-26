import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CatRolPageRoutingModule } from './cat-rol-routing.module';

import { CatRolPage } from './cat-rol.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatRolPageRoutingModule
  ],
  declarations: [CatRolPage]
})
export class CatRolPageModule {}
