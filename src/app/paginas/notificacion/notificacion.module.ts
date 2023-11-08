import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificacionPageRoutingModule } from './notificacion-routing.module';

import { NotificacionPage } from './notificacion.page';
import { NotificacionChatComponent } from '../../components/notificacion-chat/notificacion-chat.component';
import { ModalInfoSolicitudComponent } from '../../componentes/modal-info-solicitud/modal-info-solicitud.component';
//import {SpinnerComponent} from "../../componentes/spinner/spinner.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificacionPageRoutingModule
  ],
  declarations: [
    NotificacionPage, 
    NotificacionChatComponent,
      ModalInfoSolicitudComponent
  ]
})
export class NotificacionPageModule {}
