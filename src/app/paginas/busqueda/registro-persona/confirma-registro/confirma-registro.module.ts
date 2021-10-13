import { SpinnerModule } from './../../../../componentes/spinner/spinner.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmaRegistroPageRoutingModule } from './confirma-registro-routing.module';

import { ConfirmaRegistroPage } from './confirma-registro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmaRegistroPageRoutingModule,
    SpinnerModule
  ],
  declarations: [ConfirmaRegistroPage]
})
export class ConfirmaRegistroPageModule {}
