import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisFavoritosPageRoutingModule } from './mis-favoritos-routing.module';

import { MisFavoritosPage } from './mis-favoritos.page';
import {ProductosFavoritosPageModule} from './productos-favoritos/productos-favoritos.module';
import {NegociosFavoritosPageModule} from './negocios-favoritos/negocios-favoritos.module';
import {TabsPageModule} from '../tabs/tabs.module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MisFavoritosPageRoutingModule,
        ProductosFavoritosPageModule,
        NegociosFavoritosPageModule,
        TabsPageModule,
    ],
  declarations: [MisFavoritosPage]
})
export class MisFavoritosPageModule {}
