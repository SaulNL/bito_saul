import { RecargarComponent } from "./recargar.component";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [RecargarComponent],
  imports: [CommonModule, FormsModule, IonicModule],
  exports: [RecargarComponent]
})
export class RecargarModule {}
