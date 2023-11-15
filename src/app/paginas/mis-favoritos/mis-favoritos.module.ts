import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MisFavoritosPageRoutingModule } from './mis-favoritos-routing.module';
import { MisFavoritosPage } from './mis-favoritos.page';
import {TabsPageModule} from '../tabs/tabs.module';
import {SpinnerModule} from "../../componentes/spinner/spinner.module";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MisFavoritosPageRoutingModule,
        TabsPageModule,
        SpinnerModule,
    ],
  declarations: [MisFavoritosPage]
})
export class MisFavoritosPageModule {}
