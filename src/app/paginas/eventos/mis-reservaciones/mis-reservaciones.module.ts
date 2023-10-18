import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisReservacionesPageRoutingModule } from './mis-reservaciones-routing.module';

import { MisReservacionesPage } from './mis-reservaciones.page';
import {SpinnerModule} from '../../../componentes/spinner/spinner.module';
import {TabsPageModule} from "../../tabs/tabs.module";
import {DetallesReservaComponent} from "../detalles-reserva/detalles-reserva.component";
import {InfoReservacionComponent} from "../info-reservacion/info-reservacion.component";
import {SpinnerComponent} from "../../../componentes/spinner/spinner.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MisReservacionesPageRoutingModule,
        SpinnerModule,
        TabsPageModule
    ],
  declarations: [MisReservacionesPage, DetallesReservaComponent, InfoReservacionComponent, SpinnerComponent]
})
export class MisReservacionesPageModule {}
