import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservacionesPageRoutingModule } from './reservaciones-routing.module';

import { ReservacionesPage } from './reservaciones.page';
import {SpinnerModule} from '../../../componentes/spinner/spinner.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReservacionesPageRoutingModule,
        SpinnerModule
    ],
  declarations: [ReservacionesPage]
})
export class ReservacionesPageModule {}
