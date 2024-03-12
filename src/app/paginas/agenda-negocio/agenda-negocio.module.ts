import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgendaNegocioPageRoutingModule } from './agenda-negocio-routing.module';

import { AgendaNegocioPage } from './agenda-negocio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgendaNegocioPageRoutingModule
  ],
  declarations: [AgendaNegocioPage]
})
export class AgendaNegocioPageModule {}
