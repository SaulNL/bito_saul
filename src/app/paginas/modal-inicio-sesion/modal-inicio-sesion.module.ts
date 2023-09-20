import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalInicioSesionPageRoutingModule } from './modal-inicio-sesion-routing.module';

import { ModalInicioSesionPage } from './modal-inicio-sesion.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ModalInicioSesionPageRoutingModule
    ],
    exports: [
        ModalInicioSesionPage
    ],
    declarations: [ModalInicioSesionPage]
})
export class ModalInicioSesionPageModule {}
