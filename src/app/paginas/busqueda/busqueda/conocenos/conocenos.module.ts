import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConocenosPageRoutingModule } from './conocenos-routing.module';

import { ConocenosPage } from './conocenos.page';
import { ContactoPage } from '../../contacto/contacto.page';
import { FooterPage } from '../../footer/footer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConocenosPageRoutingModule
  ],
  declarations: [
    ConocenosPage,
    ContactoPage,
    FooterPage
  ]
})
export class ConocenosPageModule {}
