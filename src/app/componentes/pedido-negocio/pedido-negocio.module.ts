import { PedidoNegocioComponent } from './pedido-negocio.component';
import { SpinnerModule } from './../spinner/spinner.module';
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";



@NgModule({
  declarations: [PedidoNegocioComponent],
  imports: [CommonModule, FormsModule, IonicModule, SpinnerModule],
  exports: [PedidoNegocioComponent]
})
export class PedidoNegocioModule { }
