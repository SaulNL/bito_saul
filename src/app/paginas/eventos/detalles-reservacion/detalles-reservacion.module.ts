import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetallesReservacionPageRoutingModule } from './detalles-reservacion-routing.module';

import { DetallesReservacionPage } from './detalles-reservacion.page';
import {SpinnerModule} from '../../../componentes/spinner/spinner.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DetallesReservacionPageRoutingModule,
        SpinnerModule
    ],
  declarations: [DetallesReservacionPage]
})
export class DetallesReservacionPageModule {}
