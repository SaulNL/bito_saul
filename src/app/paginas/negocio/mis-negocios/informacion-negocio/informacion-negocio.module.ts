import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InformacionNegocioPageRoutingModule } from './informacion-negocio-routing.module';

import { InformacionNegocioPage } from './informacion-negocio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InformacionNegocioPageRoutingModule
  ],
  declarations: [InformacionNegocioPage]
})
export class InformacionNegocioPageModule {}
