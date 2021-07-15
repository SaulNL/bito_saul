import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SolicitudesPageRoutingModule } from './solicitudes-routing.module';

import { SolicitudesPage } from './solicitudes.page';
import {TabsPageModule} from '../tabs/tabs.module';



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SolicitudesPageRoutingModule,
        TabsPageModule
    ],
  declarations: [SolicitudesPage ]
})
export class SolicitudesPageModule {}
