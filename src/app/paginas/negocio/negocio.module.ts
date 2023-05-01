import { SpinnerModule } from './../../componentes/spinner/spinner.module';
import { RecargarModule } from "./../../componentes/recargar/recargar.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { NegocioPageRoutingModule } from "./negocio-routing.module";
import { NegocioPage } from "./negocio.page";
import { QRCodeModule } from "angularx-qrcode";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NegocioPageRoutingModule,
    QRCodeModule,
    RecargarModule,
    SpinnerModule
  ],
  declarations: [NegocioPage],
})
export class NegocioPageModule {}
