import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { GenerarReservacionPageRoutingModule } from './generar-reservacion-routing.module';

import { GenerarReservacionPage } from './generar-reservacion.page';
import {SpinnerModule} from '../../../componentes/spinner/spinner.module';
import {QRCodeModule} from 'angularx-qrcode';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        GenerarReservacionPageRoutingModule,
        SpinnerModule,
        QRCodeModule,
    ],
  declarations: [GenerarReservacionPage]
})
export class GenerarReservacionPageModule {}
