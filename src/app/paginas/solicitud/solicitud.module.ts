import { SpinnerModule } from './../../componentes/spinner/spinner.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SolicitudPageRoutingModule } from './solicitud-routing.module';
import { SolicitudPage } from './solicitud.page';
import { TabsPageModule } from '../tabs/tabs.module';
import { ModalInfoSolicitudComponent } from '../../componentes/modal-info-solicitud/modal-info-solicitud.component';
import {ModalInicioSesionPageModule} from "../modal-inicio-sesion/modal-inicio-sesion.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SolicitudPageRoutingModule,
        TabsPageModule,
        SpinnerModule,
        ModalInicioSesionPageModule
    ],
  declarations: [
    SolicitudPage,
    ModalInfoSolicitudComponent
  ]
})
export class SolicitudPageModule {}
