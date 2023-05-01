import { SpinnerModule } from './../../../componentes/spinner/spinner.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PedidosDialogPageRoutingModule } from './pedidos-dialog-routing.module';
import { PedidosDialogPage } from './pedidos-dialog.page';
import {TabsPageModule} from '../../tabs/tabs.module';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PedidosDialogPageRoutingModule,
        TabsPageModule,
        SpinnerModule
    ],
  declarations: [PedidosDialogPage]
})
export class PedidosDialogPageModule {}
