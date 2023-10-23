import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservacionesPageRoutingModule } from './reservaciones-routing.module';

import { ReservacionesPage } from './reservaciones.page';
import {SpinnerModule} from '../../../componentes/spinner/spinner.module';
import {CalendarioReservacionPageModule} from "../calendario-reservacion/calendario-reservacion.module";
import {ModalInicioSesionPageModule} from "../../modal-inicio-sesion/modal-inicio-sesion.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReservacionesPageRoutingModule,
        SpinnerModule,
        CalendarioReservacionPageModule,
        ModalInicioSesionPageModule
    ],
  declarations: [ReservacionesPage]
})
export class ReservacionesPageModule {}
