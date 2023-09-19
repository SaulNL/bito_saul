import { ImagenesSlideModule } from "./../imagenes-slide/imagenes-slide.module";
import { DarLikeProductoModule } from "./../dar-like-producto/dar-like-producto.module";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { DetalleProductoComponent } from "./detalle-producto.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {ModalInicioSesionPageModule} from "../../paginas/modal-inicio-sesion/modal-inicio-sesion.module";

@NgModule({
  declarations: [DetalleProductoComponent],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DarLikeProductoModule,
        ImagenesSlideModule,
        ModalInicioSesionPageModule,
    ],
  exports: [DetalleProductoComponent],
})
export class DetalleProductoModule {}
