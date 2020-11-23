import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MispromocionesPageRoutingModule } from './mispromociones-routing.module';
import { MispromocionesPage } from './mispromociones.page';
import { ModalPublicarComponent } from '../../components/modal-publicar/modal-publicar.component';
import { ModalInfoPromoComponent } from '../../components/modal-info-promo/modal-info-promo.component';
import { TabsPageModule } from '../tabs/tabs.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MispromocionesPageRoutingModule,
    TabsPageModule
  ],
  declarations: [
  	MispromocionesPage,
    ModalPublicarComponent,
    ModalInfoPromoComponent
  ]
})
export class MispromocionesPageModule {}
