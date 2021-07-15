import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NegociosFavoritosPageRoutingModule } from './negocios-favoritos-routing.module';
import { NegociosFavoritosPage } from './negocios-favoritos.page';
import {TabsPageModule} from '../../tabs/tabs.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        NegociosFavoritosPageRoutingModule,
        TabsPageModule,

    ],
    exports: [
        NegociosFavoritosPage,
    ],
    declarations: [NegociosFavoritosPage]
})
export class NegociosFavoritosPageModule {}
