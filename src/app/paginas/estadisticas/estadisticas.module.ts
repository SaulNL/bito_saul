import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EstadisticasPageRoutingModule } from './estadisticas-routing.module';
import { EstadisticasPage } from './estadisticas.page';
import {EstadisticasComponent} from '../../componentes/estadisticas/estadisticas.component';
import {InfinitoScrollModule} from '../../componentes/infinito-scroll/infinito-scroll.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        EstadisticasPageRoutingModule,
        InfinitoScrollModule
    ],
    declarations: [EstadisticasPage, EstadisticasComponent]
})
export class EstadisticasPageModule {}
