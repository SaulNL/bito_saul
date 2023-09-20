import { SpinnerModule } from '../../componentes/spinner/spinner.module';
import { RecargarModule } from '../../componentes/recargar/recargar.module';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromocionesPage } from './promociones.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';
import { Tab2PageRoutingModule } from './promociones-routing.module';
import { TabsPageModule } from '../tabs/tabs.module';
import { PromocionComponent } from '../../components/promocion/promocion.component';
import { ModalPromocionComponent } from '../../components/modal-promocion/modal-promocion.component';
import { InfoPromoComponent } from '../../components/info-promo/info-promo.component';
import { ViewQrPromocionComponent } from 'src/app/components/viewqr-promocion/viewqr-promocion.component';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import {ModalInicioSesionPageModule} from "../modal-inicio-sesion/modal-inicio-sesion.module";


@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ExploreContainerComponentModule,
        Tab2PageRoutingModule,
        TabsPageModule,
        RecargarModule,
        SpinnerModule,
        ModalInicioSesionPageModule
    ],
  declarations: [
    PromocionesPage,
    PromocionComponent,
    ModalPromocionComponent,
    ViewQrPromocionComponent,
    InfoPromoComponent
  ],
  providers: [ SocialSharing ], 
})
export class Tab2PageModule {}
