import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NegociosFavoritosPageRoutingModule } from './negocios-favoritos-routing.module';
import { NegociosFavoritosPage } from './negocios-favoritos.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        NegociosFavoritosPageRoutingModule
    ],
    exports: [
        NegociosFavoritosPage
    ],
    declarations: [NegociosFavoritosPage]
})
export class NegociosFavoritosPageModule {}
