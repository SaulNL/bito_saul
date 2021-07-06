import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { DarLikeProductoComponent } from "./dar-like-producto.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [DarLikeProductoComponent],
  imports: [CommonModule, FormsModule, IonicModule],
  exports: [DarLikeProductoComponent],
})
export class DarLikeProductoModule {}
