import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisContenidosPageRoutingModule } from './mis-contenidos-routing.module';

import { MisContenidosPage } from './mis-contenidos.page';
import { TabsPageModule } from '../../tabs/tabs.module';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    MisContenidosPageRoutingModule,
    TabsPageModule,

  ],
  providers: [InAppBrowser],
  declarations: [MisContenidosPage]
})
export class MisContenidosPageModule {}
