import { SpinnerModule } from './../../componentes/spinner/spinner.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EstadisticasPageRoutingModule } from './estadisticas-routing.module';
import { EstadisticasPage } from './estadisticas.page';
import {InfinitoScrollModule} from '../../componentes/infinito-scroll/infinito-scroll.module';
import {TabsPageModule} from '../tabs/tabs.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        EstadisticasPageRoutingModule,
        InfinitoScrollModule,
        TabsPageModule,
        SpinnerModule
    ],
    declarations: [EstadisticasPage]
})
export class EstadisticasPageModule {}
