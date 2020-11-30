import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuieroVenderPageRoutingModule } from './quiero-vender-routing.module';

import { QuieroVenderPage } from './quiero-vender.page';

import { TabsPageModule } from 'src/app/paginas/tabs/tabs.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuieroVenderPageRoutingModule,
    ReactiveFormsModule,
    TabsPageModule
  ],
  declarations: [QuieroVenderPage
  ]
})
export class QuieroVenderPageModule {}
