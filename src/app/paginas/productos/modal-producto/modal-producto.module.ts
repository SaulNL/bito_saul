import { SpinnerModule } from './../../../componentes/spinner/spinner.module';
import { ImagenesSlideModule } from "./../../../componentes/imagenes-slide/imagenes-slide.module";
import { DarLikeProductoModule } from "./../../../componentes/dar-like-producto/dar-like-producto.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ModalProductoPageRoutingModule } from "./modal-producto-routing.module";
import { ModalProductoPage } from "./modal-producto.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalProductoPageRoutingModule,
    DarLikeProductoModule,
    ImagenesSlideModule,
    SpinnerModule
  ],
  declarations: [ModalProductoPage],
})
export class ModalProductoPageModule {}
