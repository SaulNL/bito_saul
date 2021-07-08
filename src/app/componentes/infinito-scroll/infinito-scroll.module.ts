import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { InfinitoScrollComponent } from "./infinito-scroll.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [InfinitoScrollComponent],
  imports: [CommonModule, FormsModule, IonicModule],
  exports: [InfinitoScrollComponent],
})
export class InfinitoScrollModule {}
