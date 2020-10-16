import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosCatOrganizacionPageRoutingModule } from './datos-cat-organizacion-routing.module';

import { DatosCatOrganizacionPage } from './datos-cat-organizacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosCatOrganizacionPageRoutingModule
  ],
  declarations: [DatosCatOrganizacionPage]
})
export class DatosCatOrganizacionPageModule {}
