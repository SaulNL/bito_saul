import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificacionPageRoutingModule } from './notificacion-routing.module';

import { NotificacionPage } from './notificacion.page';
import { NotificacionChatComponent } from '../../components/notificacion-chat/notificacion-chat.component';
import {DetallesReservaComponent} from "../eventos/detalles-reserva/detalles-reserva.component";
import {InfoReservacionComponent} from "../eventos/info-reservacion/info-reservacion.component";
import {SpinnerComponent} from "../../componentes/spinner/spinner.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificacionPageRoutingModule
  ],
  declarations: [NotificacionPage, NotificacionChatComponent, DetallesReservaComponent, InfoReservacionComponent, SpinnerComponent]
})
export class NotificacionPageModule {}
