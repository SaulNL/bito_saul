import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CatOrganizacionPageRoutingModule } from './cat-organizacion-routing.module';

import { CatOrganizacionPage } from './cat-organizacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatOrganizacionPageRoutingModule
  ],
  declarations: [CatOrganizacionPage]
})
export class CatOrganizacionPageModule {}
