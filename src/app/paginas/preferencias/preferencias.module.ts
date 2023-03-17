import { SpinnerModule } from '../../componentes/spinner/spinner.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PreferenciasPageRoutingModule } from './preferencias-routing.module';
import { PreferenciasPage } from './preferencias.page';
import {InfinitoScrollModule} from '../../componentes/infinito-scroll/infinito-scroll.module';
import {TabsPageModule} from '../tabs/tabs.module';
import { ModalSeleccionarPreferenciasComponent } from 'src/app/components/modal-seleccionar-preferencias/modal-seleccionar-preferencias.component';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PreferenciasPageRoutingModule,
        InfinitoScrollModule,
        TabsPageModule,
        SpinnerModule
    ],
    declarations: [PreferenciasPage,ModalSeleccionarPreferenciasComponent]
})
export class PreferenciasPageModule {}
