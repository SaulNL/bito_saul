import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PromocionPageRoutingModule } from './promocion-routing.module';

import { PromocionPage } from './promocion.page';
import { SpinnerModule } from '../../componentes/spinner/spinner.module';
import { ViewQrPromocionComponent } from '../../components/viewqr-promocion/viewqr-promocion.component';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PromocionPageRoutingModule,
    SpinnerModule,
  ],
  providers: [
    SocialSharing,
  ],
  declarations: [PromocionPage]
})
export class PromocionPageModule {}
