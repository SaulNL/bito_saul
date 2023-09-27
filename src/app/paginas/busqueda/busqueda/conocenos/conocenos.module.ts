import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConocenosPageRoutingModule } from './conocenos-routing.module';

import { ConocenosPage } from './conocenos.page';
import { ContactoPage } from '../../contacto/contacto.page';
import { FooterPage } from '../../footer/footer.page';
import { TabsPageModule } from 'src/app/paginas/tabs/tabs.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConocenosPageRoutingModule,
    TabsPageModule,
    ReactiveFormsModule
  ],
  declarations: [
    ConocenosPage,
    ContactoPage,
    FooterPage
  ]
})
export class ConocenosPageModule {}
