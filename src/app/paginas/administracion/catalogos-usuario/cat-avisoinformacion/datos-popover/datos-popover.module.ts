import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosPopoverPageRoutingModule } from './datos-popover-routing.module';

import { DatosPopoverPage } from './datos-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosPopoverPageRoutingModule
  ],
  declarations: [DatosPopoverPage]
})
export class DatosPopoverPageModule {}
