import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalendarioReservacionPageRoutingModule } from './calendario-reservacion-routing.module';

import { CalendarioReservacionPage } from './calendario-reservacion.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CalendarioReservacionPageRoutingModule
    ],
    exports: [
        CalendarioReservacionPage
    ],
    declarations: [CalendarioReservacionPage]
})
export class CalendarioReservacionPageModule {}
